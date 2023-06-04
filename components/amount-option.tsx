import { motion } from 'framer-motion'

const variant = {
  hidden: { opacity: 0, bottom: -50 },
  enter: { opacity: 1, bottom: 24 },
  exit: { opacity: 0, bottom: -50 },
}

type AmountOptionProps = {
  isShow: boolean
  isLoading: boolean
  choosenAmount: number
}

export default function AmountOption(props: AmountOptionProps) {
  return (
    <motion.div
      variants={variant}
      initial='hidden'
      animate={props.isShow ? 'enter' : 'exit'}
      className='absolute z-10 flex items-center py-2 px-4 left-[50%] translate-x-[-50%] bottom-6 gap-2'>
      <div className='flex flex-col gap-2 items-center p-2 rounded-2xl bg-base-100'>
        <span>
          <kbd className='kbd kbd-sm'>1</kbd>
        </span>
        <button className='btn btn-circle btn-neutral'>
          {props.isLoading && props.choosenAmount === 1 ? <span className='loading loading-spinner'></span> : '1'}
        </button>
      </div>
      <div className='flex flex-col gap-2 items-center p-2 rounded-2xl bg-base-100'>
        <span>
          <kbd className='kbd kbd-sm'>2</kbd>
        </span>
        <button className='btn btn-circle btn-primary'>
          {props.isLoading && props.choosenAmount === 10 ? <span className='loading loading-spinner'></span> : '10'}
        </button>
      </div>
      <div className='flex flex-col gap-2 items-center p-2 rounded-2xl bg-base-100'>
        <span>
          <kbd className='kbd kbd-sm'>3</kbd>
        </span>
        <button className='btn btn-circle btn-secondary'>
          {props.isLoading && props.choosenAmount === 100 ? <span className='loading loading-spinner'></span> : '100'}
        </button>
      </div>
      <div className='flex flex-col gap-2 items-center p-2 rounded-2xl bg-base-100'>
        <span>
          <kbd className='kbd kbd-sm'>4</kbd>
        </span>
        <button className='btn btn-circle btn-accent'>
          {props.isLoading && props.choosenAmount === 1000 ? <span className='loading loading-spinner'></span> : '1000'}
        </button>
      </div>
    </motion.div>
  )
}
