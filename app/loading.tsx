"use client";
import React from 'react'
import { ClipLoader } from 'react-spinners';

const override = {
    display: 'block',
    margin: "100px auto"
}

const LoadingPage = () => {
  return (
    <ClipLoader
      color="#36d7b7"
      cssOverride={override}
      size={150}
      aria-label="Loading Spinner"
      />
  )
}

export default LoadingPage