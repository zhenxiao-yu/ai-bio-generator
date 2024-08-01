import React, { useState } from "react";
import { Button } from "../shadcn-ui/button";

// Component for a copy-to-clipboard button with a label
const CopyLabel = ({ text }: { text: string }) => {
  // State to manage the button label
  const [label, setLabel] = useState("copy");

  // Function to copy text to the clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text); // Copy the text to clipboard
    } catch (err) {
      console.error("Failed to copy the text: ", err); // Handle errors
    }
  };

  // Handle button click
  const handleClick = () => {
    copyToClipboard(text); // Copy the provided text
    setLabel("copied!"); // Update the label to indicate success
  };

  return (
    // Render a button with styles and click handler
    <Button
      onClick={handleClick}
      variant="outline"
      className="text-sm text-muted-foreground bg-background my-0 h-auto rounded-none border border-primary/20 border-t-0 rounded-b-lg hover:bg-primary hover:text-primary-foreground pt-0 pb-0.5"
    >
      {label} {/* Display the current label */}
    </Button>
  );
};

export default CopyLabel;
