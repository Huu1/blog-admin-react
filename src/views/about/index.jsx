import React from "react";
import TypingCard from "@/components/TypingCard";
import wechat from "@/assets/images/wechat.jpg";
import reward from "@/assets/images/reward.jpg";
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
