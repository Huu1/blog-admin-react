import React from "react";
import TypingCard from "@/components/TypingCard";
const About = () => {
  const cardContent = `
  `;
  return (
    <div className="app-container">
      <TypingCard title="关于作者" source={cardContent} />
    </div>
  );
};

export default About;
