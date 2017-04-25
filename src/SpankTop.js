import React, { Component } from 'react'
import JZip from 'jszip'
import Papa from 'papaparse'
import 'whatwg-fetch'
import sampleSize from 'lodash.samplesize'

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
      <div>
        {this.state.porn}
      </div>
    )
  }

  componentDidMount () {
    let handleCSV = ({data}) => {
      let newdata = sampleSize(data, 9)
        .map(row => row[0])
        .map(r => r.match(/src='(.*?)'/)[1].replace('http', 'https'))
        .map((str, idx) => <iframe src={str} key={idx} width='480' height='260' />)
      this.setState({porn: newdata})
    }
    window.fetch(
      'https://cors-anywhere.herokuapp.com/http://spankbang.com/static_desktop/CSV/spankbang.24hr.zip'
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
