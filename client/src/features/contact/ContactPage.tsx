import { useCallback, useState } from "react";

const ContactPage = () => {
  const [count, setCount] = useState(0);

  // Without useCallback
  const handleClickWithoutCallback = () => {
    console.log("Button clicked");
    setCount(count + 1);
  };

  // With useCallback
  const handleClickWithCallback = useCallback(() => {
    console.log("Button clicked");
    setCount(count + 1);
  }, [count]);

  return (
    <div className="flex flex-col">
      <button onClick={handleClickWithoutCallback}>
        Click me without useCallback
      </button>
      <p>Count: {count}</p>

      <button onClick={handleClickWithCallback}>
        Click me with useCallback
      </button>
    </div>
  );
};

export default ContactPage;
