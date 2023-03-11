import React, { useState } from "react";

function MultipleChoiceQuestion() {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const options = [
    "Option A",
   "Option B" ,
   "Option C" 
  ];
  console.log(selectedOptions);
  const handleOptionClick = (index) => {
    const isSelected = selectedOptions.includes(index);
    if (isSelected) {
      setSelectedOptions((prevSelectedOptions) =>
        prevSelectedOptions.filter((id) => id !== index)
      );
    } else {
      setSelectedOptions((prevSelectedOptions) => [
        ...prevSelectedOptions,
        index,
      ]);
    }
  };

  return (
    <div>
      <h3>Multiple Choice Question</h3>
      {options.map((option,index) => (
        <div key={index}>
          <label>
            <input
              type="checkbox"
              checked={selectedOptions.includes(index)}
              onChange={() => handleOptionClick(index)}
            />
            {option}
          </label>
        </div>
      ))}
      <p>Selected options: {selectedOptions.join(", ")}</p>
    </div>
  );
}

function SingleChoiceQuestion() {

  const [selectedOption, setSelectedOption] = useState(null);
  const options = [
    { id: 1, label: "Option A" },
    { id: 2, label: "Option B" },
    { id: 3, label: "Option C" },
    { id: 4, label: "Option D" },
  ];

  const handleOptionClick = (option) => {
    setSelectedOption(option.id);
  };

  return (
    <div>
      <h3>Single Choice Question</h3>
      {options.map((option) => (
        <div key={option.id}>
          <label>
            <input
              type="radio"
              checked={selectedOption === option.id}
              onChange={() => handleOptionClick(option)}
            />
            {option.label}
          </label>
        </div>
      ))}
      <p>Selected option: {selectedOption}</p>
    </div>
  );
}

function Quiz() {
  return (
    <div>
      <MultipleChoiceQuestion />
      <SingleChoiceQuestion />
    </div>
  );
}

export default Quiz;




// import React, { useState } from 'react';

// function Question({ question, onChange }) {
//   const { id, title, options, isMultiple } = question;
//   const [selectedOptions, setSelectedOptions] = useState(() => {
//     if (isMultiple) {
//       return options.reduce((acc, cur) => {
//         return { ...acc, [cur.id]: false };
//       }, {});
//     } else {
//       return '';
//     }
//   });

//   function handleOptionChange(optionId) {
//     if (isMultiple) {
//       setSelectedOptions((prevSelected) => {
//         return { ...prevSelected, [optionId]: !prevSelected[optionId] };
//       });
//     } else {
//       setSelectedOptions(optionId);
//     }
//     onChange(id, selectedOptions); // 呼叫onChange回傳當前選擇的選項
//     console.log(selectedOptions);
//   }

//   return (
//     <div>
//       <h3>{title}</h3>
//       {options.map((option) => {
//         return (
//           <div key={option.id}>
//             <label>
//               <input
//                 type={isMultiple ? 'checkbox' : 'radio'}
//                 name={`question-${id}`}
//                 value={option.id}
//                 checked={isMultiple ? selectedOptions[option.id] : selectedOptions === option.id}
//                 onChange={() => handleOptionChange(option.id)}
//               />
//               {option.text}
//             </label>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// function Quiz() {
//   const [questions, setQuestions] = useState([
//     {
//       id: 1,
//       title: 'What is your favorite color?',
//       isMultiple: true,
//       options: [
//         { id: 1, text: 'Red' },
//         { id: 2, text: 'Green' },
//         { id: 3, text: 'Blue' },
//       ],
//       selectedOptions: {},
//     },
//     {
//       id: 2,
//       title: 'What is your favorite food?',
//       isMultiple: false,
//       options: [
//         { id: 1, text: 'Pizza' },
//         { id: 2, text: 'Burgers' },
//         { id: 3, text: 'Tacos' },
//         { id: 4, text: 'Sushi' },
//       ],
//       selectedOptions: '',
//     },
//     {
//       id: 3,
//       title: 'What is your favorite animal?',
//       isMultiple: true,
//       options: [
//         { id: 1, text: 'Dogs' },
//         { id: 2, text: 'Cats' },
//         { id: 3, text: 'Birds' },
//         { id: 4, text: 'Fish' },
//         { id: 5, text: 'Reptiles' },
//       ],
//       selectedOptions: {},
//     },
//   ]);

//   function handleQuestionChange(id, selectedOptions) {
//     setQuestions((prevQuestions) => {
//       return prevQuestions.map((question) => {
//         if (question.id === id) {
//           return { ...question, selectedOptions };
//         } else {
//           return question;
//         }
//       });
//     });
//   }

//   return (
//     <div>
//       {questions.map((question) => {
//         return <Question key={question.id} question={question} onChange={handleQuestionChange} />;
//       })}
//     </div>
//   );
// }

// export default Quiz;