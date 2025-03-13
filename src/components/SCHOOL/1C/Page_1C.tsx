import React, { useEffect, useState } from 'react'

// 1C
const bg = 'assets/SCHOOL/1C/bg.png'
const Page_1C_eng1 = 'assets/SCHOOL/1C/Page_1C_eng1.png'
const Page_1C_eng2 = 'assets/SCHOOL/1C/Page_1C_eng2.png'
import { useLanguage } from '@/hooks/LanguageContext'

// tagalog
const Page_1C_tag1 = 'assets/SCHOOL/1C/Page_1C_tag1.png'
const Page_1C_tag2 = 'assets/SCHOOL/1C/Page_1C_tag2.png'

const Page_1C = React.forwardRef<
  HTMLDivElement,
  { page: number; onFlipNext: () => void }
>(({ page, onFlipNext }, ref) => {
  const [currentDialogue, setCurrentDialogue] = useState(0)
  const { language } = useLanguage()

  const dialogue = [
    {
      id: 'd1',
      bg: bg,
      eng: Page_1C_eng1,
      tag: Page_1C_tag1,
      left: 800,
      bottom: 350,
      width: '40%',
    },
    {
      id: 'd2',
      bg: bg,
      eng: Page_1C_eng2,
      tag: Page_1C_tag2,
      left: 800,
      bottom: 380,
      width: '40%',
    },
  ]

  const handleNextDialogue = () => {
    if (currentDialogue + 1 < dialogue.length) {
      setCurrentDialogue((prev) => prev + 1)
    } else {
      onFlipNext()
    }
  }

  useEffect(() => {
    if (page === 1 || page === 3) {
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
      <div className="flex flex-col items-center justify-end w-full h-screen">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          sizes="100vw"
          src={dialogue[currentDialogue].bg}
          alt="background"
        />
        {/* English Text */}
        <img
          className="absolute object-contain"
          style={{
            left: dialogue[currentDialogue].left,
            bottom: dialogue[currentDialogue].bottom,
            width: dialogue[currentDialogue].width,
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

Page_1C.displayName = 'Page_1C'

export default Page_1C
