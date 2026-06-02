import clsx from 'clsx'
import React from 'react'

export default function SectionTitle({ ...props }: React.ComponentProps<'h2'>) {
  return <h2 className={clsx('text-2xl font-semibold text-black mb-4', props.className)} {...props}></h2>
}
