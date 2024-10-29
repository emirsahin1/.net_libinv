'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useUser } from '@/components/common/GlobalContext'
import withAuth from '@/lib/AuthProvider'
import UserBookView from '@/components/book/UserBookView'
import LibrarianBookView from '@/components/book/LibrarianBookView'


function BookView() {
    const { user } = useUser()
    return (
        <div>
            {user?.roles?.includes('Librarian') ? (
                <LibrarianBookView />
            ) : user?.roles?.includes('Customer') ?(
                <UserBookView />
            ) : null}
        </div>
    );
}

export default withAuth(BookView)
