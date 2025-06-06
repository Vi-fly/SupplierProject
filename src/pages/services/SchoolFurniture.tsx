
const SchoolFurniture = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">School Furniture</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Classroom Furniture</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Student Desks & Chairs</li>
            <li>Teacher Desks</li>
            <li>Storage Solutions</li>
            <li>Display Boards</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Specialized Furniture</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Science Lab Equipment</li>
            <li>Library Furniture</li>
            <li>Computer Lab Setup</li>
            <li>Administrative Furniture</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SchoolFurniture; 