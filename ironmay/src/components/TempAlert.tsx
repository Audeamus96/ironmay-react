import React, { useState, useEffect } from 'react'
import { Alert } from 'react-bootstrap'

interface AlertProps {
    variant: string,
    message: string,
}

const TempAlert = ({variant, message}: AlertProps) => {

    const [show, setShow] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setShow(false);
      }, 2000);
      return () => clearTimeout(timer);
    }, []);
  
    return (
      <Alert show={show} variant={variant} onClose={() => setShow(false)} dismissible>
        {message}
      </Alert>
    );
}

export default TempAlert;