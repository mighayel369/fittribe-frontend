

export const FormatDate = (dateInput: string | Date) => {
    let date = new Date(dateInput)||new Date()
    let now = new Date()

    let today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if(msgDate.getTime()===today.getTime()){
        return "Today"
    }else if(msgDate.getTime()===yesterday.getTime()){
       return "Yesterday"
    }else{
        return msgDate.toLocaleDateString([],{month:"short",day:"numeric",year:"numeric"})
    }
}

export const formatChatTime = (dateInput: string | Date | undefined) => {
  if (!dateInput) return "";
  
  const date = new Date(dateInput);
  const now = new Date();
  
  const isToday = 
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  } else {
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric' 
    });
  }
};