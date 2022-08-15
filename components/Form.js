import React from 'react';

export default function Form({pid}) {
    const [showFeedback, toggleShowFeedback] = React.useState(true);


    const handleSubmit = async (event) => {
      event.preventDefault()
  
      const data = {
        sender: event.target.sender.value,
        feedback: event.target.feedback.value,
        article: pid
      }
  
      const JSONdata = JSON.stringify(data);
      const endpoint = 'https://gtb4huay1e.execute-api.eu-west-3.amazonaws.com/api/feedback';
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSONdata,
      }
      const response = await fetch(endpoint, options);

      await response.json();

      toggleShowFeedback(false);

    }
        if (showFeedback) {
            return (
                <form className='flex flex-col flex-grow m-4' onSubmit={handleSubmit}>
                    <input className='m-1  bg-gray-100' id='sender' type='email' aria-label='email address' placeholder='Enter your email address' />
                    <textarea className='m-1 bg-gray-100' id="feedback" name="feedback" placeholder='Write your feedback' required></textarea>
                    <button className='m-1 bg-purple-600 hover:bg-purple-800 duration-300 text-white shadow p-2 rounded-r' type="submit"> Submit </button>
                </form>
            )
        } else {
            return (
                <div>Thank you for submitting your feedback!</div>
            )
        }

  }
  