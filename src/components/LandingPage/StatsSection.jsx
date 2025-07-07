// import { motion } from "framer-motion";
// import { FaQuestionCircle, FaShare, FaUsers } from "react-icons/fa";
// import { useEffect, useState } from "react";

// // Custom hook for counting animation
// const useCountUp = (endValue, duration = 2000) => {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     let start = 0;
//     const increment = endValue / (duration / 16);
//     const interval = setInterval(() => {
//       start += increment;
//       if (start >= endValue) {
//         start = endValue;
//         clearInterval(interval);
//       }
//       setCount(Math.round(start));
//     }, 16);
//     return () => clearInterval(interval);
//   }, [endValue, duration]);

//   return count;
// };

// const stats = [
//   {
//     icon: (
//       <FaQuestionCircle className="text-5xl text-kiwi-700 dark:text-blueberry-500" />
//     ),
//     label: "Questions Asked",
//     value: 1234,
//   },
//   {
//     icon: (
//       <FaShare className="text-5xl text-kiwi-700 dark:text-blueberry-500" />
//     ),
//     label: "Answers Shared",
//     value: 567,
//   },
//   {
//     icon: (
//       <FaUsers className="text-5xl text-kiwi-700 dark:text-blueberry-500" />
//     ),
//     label: "Active Users",
//     value: 890,
//   },
// ];

// const StatsSection = () => {
//   // Call useCountUp at the component level for each stat
//   const questionsCount = useCountUp(stats[0].value, 2000);
//   const answersCount = useCountUp(stats[1].value, 2000);
//   const usersCount = useCountUp(stats[2].value, 2000);

//   return (
//     <section className="relative bg-gradient-to-r from-kiwi-100 via-white to-kiwi-100 dark:from-blueberry-800 dark:via-blueberry-900 dark:to-blueberry-800 py-20 px-4 text-center text-gray-900 dark:text-white">
//       <div className="max-w-7xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="  mb-16"
//           style={{ fontFamily: "'Fira Sans', sans-serif" }}
//         >
//           <h1 className="text-3xl font-bold md:text-4xl">Our Statistics</h1>{" "}
//           <br />
//           <p className="text-gray-600 dark:text-gray-300">
//             StuVerFlow by the numbers.
//           </p>
//         </motion.div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
//           {stats.map((stat, idx) => (
//             <motion.div
//               key={idx}
//               className="bg-white/60 dark:bg-blueberry-800/60 backdrop-blur-md p-10 rounded-2xl shadow-md hover:scale-[1.03] transition-transform duration-300 border border-gray-100 dark:border-blueberry-700"
//               initial={{ opacity: 0, y: 40 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.4, delay: idx * 0.2 }}
//             >
//               <div className="flex justify-center mb-6">
//                 <div className="p-5 bg-white/40 dark:bg-blueberry-700/30 rounded-full shadow-lg ring-2 ring-kiwi-200 dark:ring-blueberry-500">
//                   {stat.icon}
//                 </div>
//               </div>
//               <div
//                 className="text-5xl font-extrabold mb-2"
//                 style={{ fontFamily: "'Fira Sans', sans-serif" }}
//               >
//                 {idx === 0
//                   ? questionsCount
//                   : idx === 1
//                     ? answersCount
//                     : usersCount}
//               </div>
//               <p className="text-lg text-gray-700 dark:text-gray-300">
//                 {stat.label}
//               </p>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default StatsSection;
