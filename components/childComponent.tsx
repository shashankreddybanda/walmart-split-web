"use client"
import { FormEvent } from "react";

const ChildComponent = ({ myFunction }: {myFunction: (e:FormEvent<HTMLButtonElement>)=> void}) => {
    const handleClick = (e: FormEvent<HTMLButtonElement>) => {
      // Call the function from the parent component
      myFunction(e);
    };
  
    return (
      <div>
        <button onClick={handleClick}>Call Parent Function</button>
      </div>
    );
  };
  
  export default ChildComponent;