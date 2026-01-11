import React from 'react'

interface Screen{
    children : React.ReactNode
}

const Screen: React.FC<Screen> = ({children}) => {
  return (
    <div className="screen">
        {children}
    </div>
  )
}

export default Screen