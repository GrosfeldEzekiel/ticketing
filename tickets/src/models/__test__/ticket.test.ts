import { Ticket } from "../ticket"


it("Should implement OCC", async () => {
    const ticket = Ticket.build({
        price: 200,
        title: "New title",
        userId: "123"
    })

    await ticket.save()

    const firstInstance = await Ticket.findById(ticket.id)
    const secondInstance = await Ticket.findById(ticket.id)


    firstInstance!.set({ price: 10 })

    secondInstance!.set({ price: 300 })

    await firstInstance!.save()

    expect.assertions(1)
    try {
        await secondInstance!.save()
    } catch (e) {
        expect(e).toBeDefined()
    }
})

it("Should increment the version number", async () => {
    const ticket = Ticket.build({
        price: 200,
        title: "New title",
        userId: "123"
    })

    await ticket.save()

    expect(ticket.__v).toEqual(0)

    const firstInstance = await Ticket.findById(ticket.id)

    firstInstance!.set({ price: 10 })

    await firstInstance!.save()

    expect(firstInstance!.__v).toEqual(1)
})