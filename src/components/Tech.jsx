import React from "react";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import {Tilt} from "react-tilt";
import { styles } from "../styles";
import { motion } from "framer-motion";
import { textVariant } from "../utils/motion";
const ServiceCard = ({title, icon }) => {
  return (
    <Tilt className="xs:w-[250px] w-full">
      <div className="w-full green-pink-gradient p-[1px] rounded-full shadow-card">
        <div
          options={{
            max: 45,
            scale: 1,
            speed: 450,
          }}
          className="bg-tertiary rounded-full  min-h-[150px] flex justify-evenly items-center flex-col"
        >
          <img src={icon} alt={title} className="w-16 h-16 object-contain" />
          <h3 className="text-white text-[20px] font-bold text-center">
            {title}
          </h3>
        </div>
      </div>
    </Tilt>
  );
};

// Technologies
const Tech = () => {
  return (
   <>
   <motion.div variants={textVariant()}>
   <h2 className={styles.sectionHeadText}>Skills</h2><br/><br/>
   </motion.div>
    <div className="flex flex-row flex-wrap justify-center gap-10">
      {technologies.map((technology,i) => (
        <ServiceCard key={i} title={technology.name} icon={technology.icon}/>
      ))}
    </div>
    </>
  );
};

export default SectionWrapper(Tech, "");
