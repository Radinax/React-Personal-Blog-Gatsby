import React from 'react'

// Import typefaces
import 'typeface-montserrat'
import 'typeface-merriweather'

import profilePic from './profile-pic.jpg'
import { rhythm } from '../utils/typography'

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          alignContent: "center"
        }}
      >
        <img
          src={profilePic}
          alt={`Adrian Beria`}
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            width: rhythm(2.5),
            height: rhythm(2.5),
            borderRadius: "50%"
          }}
        />
        <p>
          Personal blog by React JS Web Developer <a href="https://radinax.github.io/gatsby-react-personal-portfolio/"><strong>Adrian Beria</strong></a>. Lets take a journey together into learning React!
        </p>
      </div>
    )
  }
}

export default Bio
