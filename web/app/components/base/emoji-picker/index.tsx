'use client'
import data from '@emoji-mart/data'
import { init } from 'emoji-mart'
// import AppIcon from '@/app/components/base/app-icon'
import cn from 'classnames'
import Divider from '@/app/components/base/divider'

import Button from '@/app/components/base/button'
import s from './style.module.css'
import { useState, FC } from 'react'
import {
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import React from 'react'
import Modal from '@/app/components/base/modal'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'em-emoji': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

init({ data })

const backgroundColors = [
  '#FFEAD5',
  '#E4FBCC',
  '#D3F8DF',
  '#E0F2FE',

  '#E0EAFF',
  '#EFF1F5',
  '#FBE8FF',
  '#FCE7F6',

  '#FEF7C3',
  '#E6F4D7',
  '#D5F5F6',
  '#D1E9FF',

  '#D1E0FF',
  '#D5D9EB',
  '#ECE9FE',
  '#FFE4E8',
]
interface IEmojiPickerProps {
  isModal?: boolean
  onSelect?: (emoji: string, background: string) => void
  onClose?: () => void
}

const EmojiPicker: FC<IEmojiPickerProps> = ({
  isModal = true,
  onSelect,
  onClose

}) => {
  const { categories } = data as any
  const [selectedEmoji, setSelectedEmoji] = useState('')
  const [selectedBackground, setSelectedBackground] = useState(backgroundColors[0])

  return isModal ? <Modal
    onClose={() => { }}
    isShow
    closable={false}
    className={cn(s.container, '!w-[362px] !p-0')}
  >
    <div className='flex flex-col items-center w-full p-3'>
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
        </div>
        <input type="search" id="search" className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 " placeholder="Search" />
      </div>
    </div>
    <Divider className='m-0 mb-3' />
    <div className="w-full max-h-[200px] overflow-x-hidden overflow-y-auto px-3">
      {categories.map((category: any, index: number) => {
        return <div key={`category-${index}`} className='flex flex-col'>
          <p className='font-medium uppercase text-xs text-[#101828] mb-1'>{category.id}</p>
          <div className='w-full h-full grid grid-cols-8 gap-1'>
            {category.emojis.map((emoji: string, index: number) => {
              return <div
                key={`emoji-${index}`}
                className='inline-flex w-10 h-10 rounded-lg items-center justify-center'
                onClick={() => {
                  setSelectedEmoji(emoji)
                }}
              >
                <div className='cursor-pointer w-8 h-8 p-1 flex items-center justify-center rounded-lg hover:ring-1 ring-offset-1 ring-gray-300'>
                  <em-emoji id={emoji} />
                </div>
              </div>
            })}

          </div>
        </div>
      })}
    </div>

    {/* Color Select */}
    <div className={cn('flex flex-col p-3 ', selectedEmoji == '' ? 'opacity-25' : '')}>
      <p className='font-medium uppercase text-xs text-[#101828] mb-2'>Choose Style</p>
      <div className='w-full h-full grid grid-cols-8 gap-1'>
        {backgroundColors.map((color) => {
          return <div
            key={color}
            className={
              cn(
                'cursor-pointer',
                `ring-[${color}] hover:ring-1 ring-offset-1`,
                'inline-flex w-10 h-10 rounded-lg items-center justify-center',
                color === selectedBackground ? `ring-1 ` : '',
              )}
            onClick={() => {
              setSelectedBackground(color)
            }}
          >
            <div className={cn(
              'w-8 h-8 p-1 flex items-center justify-center rounded-lg',
            )
            } style={{ background: color }}>
              {selectedEmoji !== '' && <em-emoji id={selectedEmoji} />}
            </div>
          </div>
        })}
      </div>
    </div>
    <Divider className='m-0' />
    <div className='w-full flex items-center justify-center p-3 gap-2'>
      <Button type="default" className='w-full' onClick={() => {
        onClose && onClose()
      }}>
        Cancel
      </Button>
      <Button 
       disabled={selectedEmoji == ''}
        type="primary" 
        className='w-full' 
        onClick={() => {
          onSelect && onSelect(selectedEmoji, selectedBackground)
        }}>
        OK
      </Button>
    </div>
  </Modal> : <>
  </>
}
export default EmojiPicker