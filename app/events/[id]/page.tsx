import React from 'react'
export default async function EventPage({ params }: { params: { id: string } }) {
    
    const { id } = await params;
    console.log('event id here: ',id);

    
  return (
    <div>page</div>
  )
}
