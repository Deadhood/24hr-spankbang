import React, { Component } from 'react'
import JZip from 'jszip'
import Papa from 'papaparse'
import 'whatwg-fetch'
import sampleSize from 'lodash.samplesize'
import _min from 'lodash.min'

const JSZip = JZip()

class SpankTop extends Component {
  constructor (p) {
    super(p)
    this.state = {
      porn: 'Loading...'
    }
  }
  render () {
    return (
      <div className='spankTop'>
        {this.state.porn}
      </div>
    )
  }

  componentDidMount () {
    let handleCSV = ({ data }) => {
      const vw = {
        wx: window.innerWidth || document.body.clientWidth,
        hx: window.innerHeight || document.body.clientHeight
      }
      const num = _min([
        Math.ceil(vw.hx / 260) * Math.floor(vw.wx / 480),
        data.length
      ])

      let newdata = sampleSize(data, num)
        .map(row => row[0])
        .map(r => r.match(/src='(.*?)'/)[1].replace('http', 'https'))
        .map((str, idx) => (
          <iframe
            src={str}
            key={idx}
            width='480'
            height='260'
            frameBorder='0'
            scrolling='no'
            allowFullScreen
            seamless
          />
        ))
      this.setState({ porn: newdata })
    }
    window
      .fetch(
        'https://cors-anywhere.herokuapp.com/' +
          'http://spankbang.com/static_desktop/CSV/spankbang.24hr.zip'
      )
      .then(function (res) {
        if (res.status === 200) {
          return Promise.resolve(res.arrayBuffer())
        } else {
          return Promise.reject(new Error(res.statusText))
        }
      })
      .then(zip => JSZip.loadAsync(zip))
      .then(zip => zip.file('spankbang.24hr.csv').async('string'))
      .then(csv => Papa.parse(csv))
      .then(handleCSV, console.log)
  }
}

export default SpankTop
