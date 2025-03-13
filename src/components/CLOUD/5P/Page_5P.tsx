import React, { useCallback, useMemo, useRef, useState } from 'react'

import Draggable from 'react-draggable'
import { motion, AnimatePresence } from 'framer-motion'

const bg = 'assets/CLOUD/5P/bg.png'
const plane = 'assets/CLOUD/5P/plane.png'
const cloud1 = 'assets/CLOUD/5P/CLOUDS/cloud1.png'
const cloud2 = 'assets/CLOUD/5P/CLOUDS/cloud2.png'
const cloud3 = 'assets/CLOUD/5P/CLOUDS/cloud3.png'
const cloud4 = 'assets/CLOUD/5P/CLOUDS/cloud4.png'
const cloud5 = 'assets/CLOUD/5P/CLOUDS/cloud5.png'
const cloud_dialogue_box_eng = 'assets/CLOUD/5P/cloud_dialogue_box_eng.png'
const cloud_hit = 'assets/CLOUD/5P/cloud_hit.png'

import { useLanguage } from '@/hooks/LanguageContext'

// tagalog
const cloud_dialogue_box_tag = 'assets/CLOUD/5P/cloud_dialogue_box_tag.png'
const cloud_hit_tag = 'assets/CLOUD/5P/cloud_hit_tag.png'
// The pixelPerfectCollision function from above
import { pixelPerfectCollision } from '@/utils/pixelCollision'

const cloudHitAudio = 'audio/SFX/cloud_hit.mp3'

const Page_5P = React.forwardRef<HTMLDivElement, { onFlipNext: () => void }>(
  ({ onFlipNext }, ref) => {
    const { language } = useLanguage()
    const [planePosition, setPlanePosition] = useState({ x: 100, y: 0 })
    const [showInstructions, setShowInstructions] = useState(true)
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
    const planeRef = useRef<HTMLDivElement>(null)
    const cloudRefs = useRef<HTMLDivElement[]>([])
    const finishLineRef = useRef<HTMLDivElement>(null)

    const [showCloudHitModal, setShowCloudHitModal] = useState(false)

    const clouds = useMemo(
      () => [
        { id: 'cloud1', x: 1280, y: 600, width: '55%', img: cloud1 },
        { id: 'cloud2', x: 1100, y: 85, width: '30%', img: cloud2 },
        { id: 'cloud3', x: 560, y: 420, width: '100%', img: cloud3 },
        { id: 'cloud6', x: 800, y: 820, width: '100%', img: cloud3 },
        { id: 'cloud4', x: 20, y: 750, width: '30%', img: cloud4 },
        { id: 'cloud5', x: 40, y: 10, width: '40%', img: cloud5 },
        { id: 'cloud7', x: 1300, y: 820, width: '20%', img: cloud3 },
      ],
      []
    )

    const playCloudHitAudio = useCallback(() => {
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }

      const newAudio = new Audio(cloudHitAudio)
      newAudio.play()
      setAudio(newAudio)
    }, [audio])

    // get bounding box of finish line
    const finishLine = finishLineRef.current?.getBoundingClientRect()

    // check if plane has touched finish line
    const checkFinishLine = useCallback(() => {
      if (!finishLine || !planeRef.current) return

      const plane = planeRef.current.getBoundingClientRect()
      if (plane.right >= finishLine.left) {
        console.log('Plane has crossed the finish line!')
        onFlipNext()
        // reset everything
        setTimeout(() => {
          setPlanePosition({ x: 100, y: 0 })
          setShowInstructions(true)
        }, 1500)
      }
    }, [onFlipNext, finishLine])
    const [dragKey, setDragKey] = useState(0)
    const checkCollisions = useCallback(async () => {
      if (!planeRef.current) return

      // Check plane vs each cloud
      for (let i = 0; i < cloudRefs.current.length; i++) {
        const cloudDiv = cloudRefs.current[i]
        if (!cloudDiv) continue

        const collided = await pixelPerfectCollision(planeRef.current, cloudDiv)
        if (collided) {
          console.log('Game Over! Plane hit cloud:', clouds[i].id)
          playCloudHitAudio()
          // Show modal
          // setTimeOut to show modal
          setShowCloudHitModal(true)

          setTimeout(() => {
            setShowCloudHitModal(false)
          }, 3000)

          // Reset plane position
          setPlanePosition({ x: 100, y: 0 })

          // Force remount of Draggable by updating the key.
          setDragKey((prev) => prev + 1)

          break
        }
      }
    }, [clouds, playCloudHitAudio])

    const startGame = () => {
      setShowInstructions(false)
    }

    return (
      <div className="relative w-full h-full" ref={ref}>
        {showInstructions && (
          <div
            onClick={startGame}
            className="z-[20] cursor-pointer absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white"
          >
            {/* dialogue */}
            <img
              className="absolute object-contain"
              style={{
                bottom: 0,
                width: '70%',
              }}
              src={
                language === 'eng'
                  ? cloud_dialogue_box_eng
                  : cloud_dialogue_box_tag
              }
              alt="dialogue"
            />
          </div>
        )}

        <div className="flex items-center h-full w-full">
          {/* Finish Line Ref */}
          <div
            ref={finishLineRef}
            className="bg-red-500 w-[1px] h-full"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
            }}
          ></div>
          {/* Background */}
          <img
            className="object-cover h-full w-full"
            src={bg}
            alt="background"
          />

          {/* Clouds */}
          {clouds.map((cloud, index) => (
            <div
              key={cloud.id}
              ref={(el) => {
                if (el) {
                  cloudRefs.current[index] = el
                }
              }}
              className={
                cloud.id === 'cloud3'
                  ? 'absolute animate-cloud'
                  : cloud.id === 'cloud6'
                  ? 'absolute animate-cloud3'
                  : cloud.id === 'cloud2'
                  ? 'absolute animate-cloud3'
                  : cloud.id === 'cloud1'
                  ? 'absolute animate-cloud2'
                  : 'absolute animate-cloud'
              }
              style={{
                scale: 1.1,
                width: cloud.width,
                left: cloud.x,
                top: cloud.y,
              }}
            >
              <img draggable={false} src={cloud.img} alt="cloud" />
            </div>
          ))}

          <Draggable
            key={dragKey}
            position={planePosition}
            onDrag={(e, data) => {
              setPlanePosition({ x: data.x, y: data.y })
              checkCollisions()
              checkFinishLine()
            }}
            onStop={(e, data) => {
              setPlanePosition({ x: data.x, y: data.y })
              checkCollisions()
            }}
            nodeRef={planeRef as React.RefObject<HTMLElement>}
          >
            <div ref={planeRef} className="absolute z-10">
              <img
                className="cursor-pointer animate-updown"
                draggable={false}
                src={plane}
                alt="plane"
                style={{ width: '150px' }}
              />
            </div>
          </Draggable>

          {/* Animated Catch Modal */}
          <AnimatePresence>
            {showCloudHitModal && (
              <motion.div
                className={`absolute mr-28 pointer-events-none flex items-end inset-0 justify-end transition-opacity duration-300`}
                initial={{ translateY: '20px', opacity: 0 }}
                animate={{ translateY: '0px', opacity: 1 }}
                exit={{ translateY: '20px', opacity: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 10 }}
              >
                <img
                  className="object-cover"
                  src={language === 'eng' ? cloud_hit : cloud_hit_tag}
                  style={{ width: '40%', height: 'auto' }}
                  alt="caught fish"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }
)

Page_5P.displayName = 'Page_5P'
export default Page_5P
