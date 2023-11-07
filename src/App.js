import React, { useState, useEffect, useRef } from 'react'
import { Layer, Stage, Image, Label, Text as KonvaText } from 'react-konva'
import QRCode from 'qrcode'
import stringify from 'json-stringify-pretty-compact'

const STAGE_WIDTH = 400
const STAGE_HEIGHT = 600
const canvas = document.createElement('canvas')
canvas.width = STAGE_WIDTH
canvas.height = STAGE_HEIGHT
const ctx = canvas.getContext('2d')
const FONT_NAME = 'Helvetica'

function App() {
  const [input, setInput] = useState(`[
  {"x": 50, "y": 40, "type": "TEXT", "body": "Hello World!", "size": 50},
  {"x": 50, "y": 100, "type": "QR", "body": "https://neonship.app"}
]`)
  const konvaLayer = useRef(null)
  const [elements, setElements] = useState([])
  const [validInput, setValidInput] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(null)

  useEffect(() => {
    async function parseInput() {
      let items = []
      try {
        items = JSON.parse(input)
        if (!Array.isArray(items)) throw new Error('Input is not an array')
        setValidInput(true)
      } catch (err) {
        setValidInput(false)
        return
      }

      const newElements = await Promise.all(
        items.map(async el => {
          if (el.type === 'QR') {
            const img = new window.Image()
            img.src = await QRCode.toDataURL(el.body)
            await new Promise(resolve => (img.onload = resolve))
            return { ...el, img: img, width: img.width, height: img.height }
          } else {
            ctx.font = `${el.size}px ${FONT_NAME} normal`
            el.width = el.width || Math.min(Math.ceil(ctx.measureText(el.body).width + el.size * 3), STAGE_WIDTH - 20)
            return el
          }
        })
      )

      setElements(newElements)
    }
    parseInput()
  }, [input])

  function handleDrag(e, index) {
    let newElements = elements.map(item => ({ ...item }))
    if (elements[index].center === true) {
      newElements[index].x = e.target.x() + elements[index].width / 2
    } else {
      newElements[index].x = e.target.x()
    }
    newElements[index].y = e.target.y()
    setElements(newElements)

    setInput(
      JSON.stringify(
        newElements.map(item => {
          item = { ...item }
          delete item.width
          delete item.height
          delete item.img
          return item
          // return '  ' + stringify(item, { maxLength: 60 })
        }),
        null,
        2
      )
    )
  }

  console.log('newEle', elements[1])
  return (
    <div>
      <h1>Label Maker</h1>
      <main style={{ display: 'flex' }}>
        <section style={{ width: 550, marginRight: 50 }}>
          <h2>Valid Input: {validInput ? '✅' : '❌'}</h2>
          <h2>JSON, JS, PHP, RUBY, JAVA</h2>
          <textarea
            style={{
              width: '100%',
              height: '520px',
              border: '1px solid #ccc',
              fontSize: 13,
              fontFamily: '"SF Mono", monospace',
            }}
            locale={'en'}
            onChange={e => setInput(e.target.value)}
            value={input}
            placeholder={input}
            height="250px"
            width="100%"
          />
        </section>
        <section style={{ border: '1px solid #ccc', borderRadius: 5, boxShadow: '0 0 10px #ccccccff' }}>
          <Stage width={400} height={600}>
            <Layer ref={konvaLayer}>
              {elements.map((el, index) => {
                const selected = selectedIndex === index
                const isText = el.type === 'TEXT'

                let props
                let ReactElement = null
                if (el.type === 'QR') {
                  ReactElement = Image
                  console.log('render', el.img.src)
                  props = { image: el.img }
                } else if (el.type === 'TEXT') {
                  ReactElement = KonvaText
                  props = {
                    text: el.body,
                    fontFamily: FONT_NAME,
                    fontSize: el.size,
                    width: el.width,
                    fill: 'black',
                  }
                }

                return React.createElement(ReactElement, {
                  x: el.center ? el.x - el.width / 2 : el.x,
                  y: el.y,
                  rotation: el.rotation,
                  zIndex: index,
                  ...props,
                  key: index,
                  draggable: true,
                  width: props.width || el.width,
                  height: props.height || el.height,
                  image: el.img,
                  shadowColor: selected ? '#122064' : undefined,
                  shadowOpacity: selected ? (isText ? 0.6 : 0.3) : undefined,
                  shadowBlur: selected ? (isText ? 30 : 20) : undefined,
                  onDragMove: e => {
                    handleDrag(e, index)
                    e.target.getStage().container().style.cursor = 'grabbing'
                  },
                  onDragEnd: e => {
                    handleDrag(e, index)
                    e.target.getStage().container().style.cursor = 'default'
                  },
                  onMouseEnter: e => {
                    setSelectedIndex(index)
                    e.target.getStage().container().style.cursor = 'grab'
                  },
                  onMouseLeave: e => {
                    setSelectedIndex(null)
                    e.target.getStage().container().style.cursor = 'default'
                  },
                })
              })}
            </Layer>
          </Stage>
        </section>
      </main>
    </div>
  )
}

export default App
