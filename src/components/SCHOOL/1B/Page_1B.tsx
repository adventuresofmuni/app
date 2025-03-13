import React, { useEffect, useState } from 'react'

// 1B
const bg = 'assets/SCHOOL/1B/bg.png'
const Page_1B_eng1 = 'assets/SCHOOL/1B/Page_1B_eng1.png'
const Page_1B_eng2 = 'assets/SCHOOL/1B/Page_1B_eng2.png'
const Page_1B_eng3 = 'assets/SCHOOL/1B/Page_1B_eng3.png'

// tagalog
const Page_1B_tag1 = 'assets/SCHOOL/1B/Page_1B_tag1.png'
const Page_1B_tag2 = 'assets/SCHOOL/1B/Page_1B_tag2.png'
const Page_1B_tag3 = 'assets/SCHOOL/1B/Page_1B_tag3.png'
import { useLanguage } from '@/hooks/LanguageContext'

const Page_1B = React.forwardRef<
  HTMLDivElement,
  { page: number; onFlipNext: () => void }
>(({ page, onFlipNext }, ref) => {
  const [currentDialogue, setCurrentDialogue] = useState(0)
  const { language } = useLanguage()

  const dialogue = [
    {
      id: 'd1',
      bg: bg,
      eng: Page_1B_eng1,
      tag: Page_1B_tag1,
      left: 500,
      bottom: 200,
      bottom_tag: 200,
      width: '50%',
      width_tag: '38%',
    },
    {
      id: 'd2',
      bg: bg,
      eng: Page_1B_eng2,
      tag: Page_1B_tag2,
      left: 600,
      bottom: 200,
      bottom_tag: 200,
      width: '37%',
    },
    {
      id: 'd3',
      bg: bg,
      eng: Page_1B_eng3,
      tag: Page_1B_tag3,
      left: 600,
      bottom: 230,
      bottom_tag: 200,
      width: '40%',
    },
  ]

  const handleNextDialogue = () => {
    if (currentDialogue + 1 < dialogue.length) {
      setCurrentDialogue((prev) => {
        const nextIndex = prev + 1
        return nextIndex
      })
    } else {
      onFlipNext()
    }
  }

  useEffect(() => {
    if (page === 0 || page === 2) {
      setCurrentDialogue(0)
    }
  }, [page])

  return (
    <div
      className="relative w-full h-full cursor-pointer"
      ref={ref}
      onClick={handleNextDialogue}
    >
      {/* Background Wrapper */}
      <div className="flex flex-col items-center justify-end w-full h-full">
        <img
          className="absolute w-full h-full inset-0 object-cover"
          src={dialogue[currentDialogue].bg}
          alt="background"
        />
        {/* English Text */}
        <img
          className="absolute object-contain"
          style={{
            left: dialogue[currentDialogue].left,
            bottom: dialogue[currentDialogue].bottom,
            width: (() => {
              if (language === 'eng') {
                return dialogue[currentDialogue].width
              } else {
                return (
                  dialogue[currentDialogue].width_tag ||
                  dialogue[currentDialogue].width
                )
              }
            })(),
          }}
          src={
            language === 'eng'
              ? dialogue[currentDialogue].eng
              : dialogue[currentDialogue].tag
          }
          alt="dialogue"
        />
      </div>
    </div>
  )
})

Page_1B.displayName = 'Page_1B'

export default Page_1B
