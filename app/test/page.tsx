"use client"
import ChildComponent from "@/components/childComponent";
import { FormEvent } from "react";

const ParentComponent = () => {
    const myFunction = (e: FormEvent<HTMLButtonElement>) => {
        // 'use server'
      // Your function logic here
      console.log('Function called from child component');
    };
  
    return (
      <div>
        <ChildComponent myFunction={myFunction} />
      </div>
    );
  };
  
  export default ParentComponent;