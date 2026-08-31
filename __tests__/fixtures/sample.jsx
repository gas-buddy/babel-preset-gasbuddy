import React from 'react';

export default function Greeting({ name, onClick }) {
  const label = name?.trim() ?? 'stranger';
  return (
    <button type="button" onClick={onClick}>
      Hello, {label}!
    </button>
  );
}
