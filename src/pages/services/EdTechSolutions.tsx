
const EdTechSolutions = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">EdTech Solutions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Digital Learning Solutions</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Interactive Learning Platforms</li>
            <li>Virtual Classrooms</li>
            <li>Learning Management Systems</li>
            <li>Educational Apps</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Smart Classroom Solutions</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Interactive Whiteboards</li>
            <li>Digital Projectors</li>
            <li>Audio-Visual Equipment</li>
            <li>Smart Class Software</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EdTechSolutions; 