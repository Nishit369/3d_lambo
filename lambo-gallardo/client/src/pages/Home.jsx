import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSnapshot } from 'valtio';
import { headContainerAnimation, headContentAnimation, headTextAnimation, slideAnimation} from '../config/motion';
import state from '../store/index'
import { CustomButton } from '../components';

const Home = () => {
    const snap = useSnapshot(state);

  return (
    <AnimatePresence>
        {snap.intro && (
           <motion.section className='home' {...slideAnimation('left')}>
               

                <motion.div className='home-content' {...headContainerAnimation}>
                    <motion.div {...headTextAnimation}>
                        <h1 className='head-text'>
                            LAMBORGHINI <br className='xl:block hidden'/> GALLARDO. 
                        </h1>
                    </motion.div>
                    <motion.div 
                        {...headContentAnimation}
                        className='flex flex-col gap-5'
                        >
                        <p className=' font-normal text-xl text-gray-600 text-white'>
                        Craft your dream ride! Personalize every inch with our cutting-edge 3D car customization tool.<br/>
                        <strong> Unleash Your Imagination and create your own beast. </strong>
                        </p>
                        <CustomButton
                            type="filled"
                            title="Start Customizing"
                            handleClick={()=>state.intro=false}
                            customStyles = "w-fit px-4 py-2.5 font-bold text-sm"
                        />
                    </motion.div>
                </motion.div>

           </motion.section>
        )}
    </AnimatePresence>
  )
}

export default Home