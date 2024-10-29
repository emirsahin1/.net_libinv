'use client'

import { getBooks } from '@/api/book_api';
import FeaturedBooks from '@/components/book/FeaturedBooks'
import withAuth from '@/lib/AuthProvider';
import { Book } from '@/types/Book';
import React, { useEffect, useState } from 'react'

function FeaturedPage() {
    return (
        <div className='container mx-auto p-6'>
            <FeaturedBooks />
        </div>
    )
}

export default withAuth(FeaturedPage)
