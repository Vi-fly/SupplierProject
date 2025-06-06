import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>();

// Connection pool configuration
const MAX_CONNECTIONS = 10;
const connectionPool = new Set();

interface PricingTable extends Tables<'pricing_tables'> {
  features: Array<{ name: string; included: boolean }>;
}

class PricingService {
  private static instance: PricingService;
  private cache: Map<string, { data: any; timestamp: number }>;
  private connectionPool: Set<any>;

  private constructor() {
    this.cache = new Map();
    this.connectionPool = new Set();
  }

  public static getInstance(): PricingService {
    if (!PricingService.instance) {
      PricingService.instance = new PricingService();
    }
    return PricingService.instance;
  }

  private async getConnection() {
    if (this.connectionPool.size >= MAX_CONNECTIONS) {
      // Wait for a connection to become available
      await new Promise(resolve => setTimeout(resolve, 100));
      return this.getConnection();
    }
    const connection = supabase;
    this.connectionPool.add(connection);
    return connection;
  }

  private releaseConnection(connection: any) {
    this.connectionPool.delete(connection);
  }

  private getCacheKey(supplierId: string, id?: string): string {
    return id ? `pricing_${supplierId}_${id}` : `pricing_${supplierId}`;
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < CACHE_TTL;
  }

  async getPricingTables(supplierId: string): Promise<PricingTable[]> {
    const cacheKey = this.getCacheKey(supplierId);
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    const connection = await this.getConnection();
    try {
      const { data, error } = await connection
        .from('pricing_tables')
        .select('*')
        .eq('supplier_id', supplierId);

      if (error) throw error;

      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } finally {
      this.releaseConnection(connection);
    }
  }

  async getPricingTable(id: string, supplierId: string): Promise<PricingTable | null> {
    const cacheKey = this.getCacheKey(supplierId, id);
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    const connection = await this.getConnection();
    try {
      const { data, error } = await connection
        .from('pricing_tables')
        .select('*')
        .eq('id', id)
        .eq('supplier_id', supplierId)
        .single();

      if (error) throw error;

      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } finally {
      this.releaseConnection(connection);
    }
  }

  async createPricingTable(pricingTable: Omit<PricingTable, 'id' | 'created_at' | 'updated_at'>): Promise<PricingTable> {
    const connection = await this.getConnection();
    try {
      const { data, error } = await connection
        .from('pricing_tables')
        .insert(pricingTable)
        .select()
        .single();

      if (error) throw error;

      // Invalidate cache for this supplier
      this.cache.delete(this.getCacheKey(pricingTable.supplier_id));

      return data;
    } finally {
      this.releaseConnection(connection);
    }
  }

  async updatePricingTable(id: string, supplierId: string, updates: Partial<PricingTable>): Promise<PricingTable> {
    const connection = await this.getConnection();
    try {
      const { data, error } = await connection
        .from('pricing_tables')
        .update(updates)
        .eq('id', id)
        .eq('supplier_id', supplierId)
        .select()
        .single();

      if (error) throw error;

      // Invalidate cache for this supplier and specific pricing table
      this.cache.delete(this.getCacheKey(supplierId));
      this.cache.delete(this.getCacheKey(supplierId, id));

      return data;
    } finally {
      this.releaseConnection(connection);
    }
  }

  async deletePricingTable(id: string, supplierId: string): Promise<void> {
    const connection = await this.getConnection();
    try {
      const { error } = await connection
        .from('pricing_tables')
        .delete()
        .eq('id', id)
        .eq('supplier_id', supplierId);

      if (error) throw error;

      // Invalidate cache for this supplier and specific pricing table
      this.cache.delete(this.getCacheKey(supplierId));
      this.cache.delete(this.getCacheKey(supplierId, id));
    } finally {
      this.releaseConnection(connection);
    }
  }
}

export const pricingService = PricingService.getInstance(); 