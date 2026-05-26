

export const cleanTrainerFilters = (filter: any) => {
    const cleanedFilters = Object.fromEntries(
        Object.entries(filter).filter(([_, value]) => value !== '')
    )
    return cleanedFilters
}