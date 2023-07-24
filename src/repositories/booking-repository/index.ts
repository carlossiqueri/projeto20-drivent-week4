import { prisma } from "../../config";

async function getBooking(userId: number){
    return await prisma.booking.findFirst({
        select:{id: true, Room: true},
        where: {userId} 
    })
}

async function postBooking() {
    
}

async function updateBooking() {
    
}

const bookingRepository = {
    getBooking, postBooking, updateBooking
}

export default bookingRepository;