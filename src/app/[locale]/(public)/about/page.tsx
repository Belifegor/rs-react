import { Link } from '../../../../i18n/navigation';

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-2xl w-full bg-gray-800 rounded-lg shadow-xl p-8 mt-5">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          About the Author
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <div className="bg-gray-700 rounded-full w-24 h-24 flex items-center justify-center">
            <span className="text-4xl">👨‍💻</span>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-2xl font-semibold text-blue-400 mb-2">
              Alexandr Belifegor
            </h2>
            <p className="text-gray-300 mb-1">
              <span className="font-medium">Role:</span> Front-End Developer
              (React student)
            </p>
            <a
              href="https://github.com/belifegor"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              GitHub Profile
            </a>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-xl font-semibold mb-3 text-white">Bio</h3>
          <p className="text-gray-300 mb-3">
            I am currently studying front-end development with a focus on React
            at{' '}
            <a
              className="text-blue-400 hover:text-blue-300 underline"
              href="https://rs.school/courses/reactjs"
              target="_blank"
              rel="noopener noreferrer"
            >
              RS School
            </a>
            .
          </p>
          <p className="text-gray-300 mb-3">
            I enjoy learning how modern web technologies work and building
            clean, responsive interfaces. This course is helping me grow both
            technically and creatively.
          </p>
          <p className="text-gray-300 italic">
            Still learning, still building, still dreaming.
          </p>
        </div>

        <div className="flex justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
