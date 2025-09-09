import React from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Checkout from "../components/Checkout/Checkout.jsx"
import CheckoutSteps from "../components/Checkout/CheckoutSteps.jsx"

const CheckoutPage = () => {
  return (
    <div>
      <br />
      <br />
      <CheckoutSteps active={1} />
       <Checkout />
       <br />
       <br />
       <Footer />
    </div>
  )
}

export default CheckoutPage