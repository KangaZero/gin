"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function NotFound() {
  const [randomPet, setRandomPet] = useState<string>('/images/pets/dog_1.jpg')
  const [rotation, setRotation] = useState<number>(0)
  
  const petTypes = ['cat', 'dog', 'bird', 'rabbit', 'hamster', 'turtle', 'fish', 'snake', 'lizard', 'guineapig']

  useEffect(() => {
    // Pick a random pet type and image number
    const randomType = petTypes[Math.floor(Math.random() * petTypes.length)]
    const randomNum = Math.floor(Math.random() * 5) + 1
    setRandomPet(`/images/pets/${randomType}_${randomNum}.jpg`)
    
    // Set a random rotation for the pet image
    setRotation(Math.random() * 20 - 10)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <Card className="w-full max-w-md text-center shadow-lg border-4 border-border">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">404</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative mx-auto w-48 h-48">
            <Image 
              src={randomPet}
              alt="Lost pet" 
              fill
              style={{ 
                transform: `rotate(${rotation}deg)`,
                borderRadius: '50%',
                objectFit: 'cover'
              }}
              className="border-4 border-border shadow-md transition-all hover:scale-105"
            />
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-2">Oh no! This pet is lost!</h2>
            <p className="text-lg mb-4">The page you're looking for has wandered off.</p>
            
            <div className="flex items-center justify-center gap-4 mt-6">
              <Avatar className="size-12">
                <AvatarImage src="/images/users/default_profile.jpg" alt="User" />
                <AvatarFallback>404</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="font-bold">Pet Tracker</p>
                <p className="text-sm">Help us find our way back!</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pt-4">
          <Link 
            href="/" 
            className="px-8 py-3 bg-primary text-primary-foreground rounded-md font-semibold transition-all hover:bg-primary/90 active:scale-95"
          >
            Return Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}