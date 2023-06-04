import { motion } from 'framer-motion'
import { ReactNode } from 'react'

type HintProps = {
  children: ReactNode
  isShow: boolean
}

const variant = {
  hidden: { opacity: 0, bottom: -50 },
  enter: { opacity: 1, bottom: 24 },
  exit: { opacity: 0, bottom: -50 },
}

export default function Hint(props: HintProps) {
  return (
    <motion.div
      variants={variant}
      initial='hidden'
      animate={props.isShow ? 'enter' : 'exit'}
      className='absolute z-10 flex items-center flex-col rounded-2xl py-2 px-4 bg-base-200 left-[50%] translate-x-[-50%] bottom-6'>
      <span className=' text-md font-semibold text-neutral-content'>{props.children}</span>
    </motion.div>
  )
}
