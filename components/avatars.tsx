import usePlayerStore from '@/stores/player'
import Avatar from 'boring-avatars'

export default function Avatars() {
  const [players] = usePlayerStore((state) => [state.players])

  return (
    <div className='flex absolute inset-0 top-6 left-6 max-h-[60vh] h-fit '>
      <div className='avatar-group flex flex-col -space-y-6 p-2 rounded-full bg-base-200'>
        {players &&
          Object.values(players).map((player) => (
            <div className='avatar' key={player.id}>
              <div className='w-12'>
                <Avatar
                  size={48}
                  name={player.walletAddress}
                  variant='beam'
                  colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                />
              </div>
            </div>
          ))}
      </div>

      {/* <div className='avatar placeholder'>
          <div className='w-12 bg-neutral-focus text-neutral-content'>
            <span>+99</span>
          </div>
        </div> */}
    </div>
  )
}
