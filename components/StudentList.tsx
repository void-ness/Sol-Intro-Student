import { Card } from './Card'
import { FC, useEffect, useState } from 'react'
import { StudentIntro } from '../models/StudentIntro'

const STUDENT_INTRO_PROGRAM_ID = 'HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf'

export const StudentList: FC = () => {
    const [studIntros, setStudIntros] = useState<StudentIntro[]>([])

    useEffect(() => {
        setStudIntros(StudentIntro.mocks)
    }, [])

    return (
        <div>
            {
                studIntros.map((studIntro, i) => {
                    return (
                        <Card key={i} intro={studIntro} />
                    )
                })
            }
        </div>
    )
}