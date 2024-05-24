import React, { useState, useEffect } from 'react';
import { requestToGroqAi } from "./utils/groq";
import { Light as SyntaxHighlight } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import './App.css';

function App() {
  const [question, setQuestion] = useState("");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false); // Tambahkan state untuk menunjukkan status loading
  const [typingEffect, setTypingEffect] = useState("");
  const typingSpeed = 30; // Tentukan kecepatan mengetik (dalam milidetik per karakter)

  useEffect(() => {
    let typingInterval;

    if (data) {
      let index = 0;
      typingInterval = setInterval(() => {
        setTypingEffect(prev => prev + data.charAt(index));
        index++;
        if (index === data.length) clearInterval(typingInterval);
      }, typingSpeed);
    }

    return () => clearInterval(typingInterval);
  }, [data, typingSpeed]);

  const copyToClipboard = () => {
    const el = document.createElement('textarea');
    el.value = data;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert('Jawaban berhasil disalin!');
  };

  const handleSubmit = async (userInput) => {
    if (!userInput.trim()) return; // Jika input kosong, jangan lanjutkan
    if (data) return; // Jika sudah ada jawaban, tidak perlu mengirim ulang pertanyaan

    setLoading(true); // Atur status loading menjadi true

    // Panggil API dengan penundaan 2 detik menggunakan setTimeout
    setTimeout(async () => {
      const ai = await requestToGroqAi(userInput);
      setData(ai);
      setLoading(false); // Setelah mendapatkan data, atur status loading menjadi false
      setTypingEffect(""); // Reset typing effect
      setQuestion(userInput);
    }, 1500);
  };

  return (
    <main className="flex flex-col min-h-[80vh] justify-center items-center max-w-xl w-full mx-auto">
      <h1 className="text-5xl text-indigo-500">
        AI-CUY
      </h1>
      <div className='max-w-xl w-full mx-auto'>
        {loading ? ( // Tampilkan pesan loading jika sedang memuat
          <div className='text-white py-4'>Bentar nyett...</div>
        ) : data ? (
          <>
            <SyntaxHighlight language="swift" style={darcula} wrapLongLines={true}>{typingEffect}</SyntaxHighlight>
            <button onClick={copyToClipboard} className='bg-indigo-500 py-2 px-4 font-bold text-white rounded-md mt-4'>Salin Jawaban</button>
          </>
        ) : null}
      </div>
      <form className='flex flex-col gap-4 py-4 w-full'>
        <input
          placeholder='Mau Tanya Apa ges.....'
          className='py-2 px-4 text-md rounded-md'
          id='content'
          defaultValue={question}
        />
        <button onClick={() => handleSubmit(document.getElementById('content').value)} type='button' className='bg-indigo-500 py-2 px-4 font-bold text-white rounded-md'>Kirim</button>
      </form>
    </main>
  );
}

export default App;
