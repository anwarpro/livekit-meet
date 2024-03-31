// import { LiaUserTimesSolid } from "react-icons/lia";

const Error = () => {
  return (
    <div className="fixed h-full w-full top-0 left-0 flex justify-center items-center bg-primary-900">
      <div className="flex items-center flex-col bg-primary-700 w-full mx-2 max-w-2xl rounded-xl border border-primary-500 shadow-sm p-6 text-center">
        <span className="text-4xl">
          {/* <LiaUserTimesSolid className="text-red-600" /> */}
        </span>
        <h1 className="text-xl font-semibold font-rubik uppercase">
          Error<span className="text-red-600">!</span>
        </h1>
        <p className="font-light text-sm mt-5">
          {
            "We apologize, but we're currently experiencing difficulty loading the user's information. Please attempt your request again at a later time. If the problem persists, please contact support."
          }
        </p>
        <p className="font-light text-sm mt-5">
          Please ensure that you are logged in to the following website:
          <a
            href="https://web.programming-hero.com/login"
            className="ml-1 font-medium text-blue-600"
            target="_blank"
          >
            web.programming-hero.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default Error;
