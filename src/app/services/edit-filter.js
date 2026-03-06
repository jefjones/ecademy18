export default (personId) => ({
    personId: personId,
    status: {
        pending: true,
        accepted: true,
        notAccepted: true,
    },
    vote: {
        upVote: false,
        downVote: false,
        trollVote: false,
    },
    editType: {
        edits: true,
        comments: true,
    },
    sort: {
        orderBy: 'EntryDate',
        direction: 'asc',
        isNumber: false
    }
});
