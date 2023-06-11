import React from 'react'

const Success = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <h1>Your payment is successful!</h1>
      <button onClick={() => {
        window.location.href = "http://localhost:3000"
      }}>Redirect to the home page</button>
    </div>
  )
}

export default Success;