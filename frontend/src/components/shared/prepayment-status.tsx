import { Badge } from "@/components/ui/badge"
import { Clock, CreditCard } from "lucide-react"
import { format } from "date-fns"

interface PrepaymentStatusProps {
  isPrepaid: boolean
  prepaymentInfo?: {
    amount: number
    endDate: string
    durationType: string
    durationValue: number
  }
  className?: string
}

export function PrepaymentStatus({ isPrepaid, prepaymentInfo, className }: PrepaymentStatusProps) {
  if (!isPrepaid || !prepaymentInfo) {
    return (
      <Badge variant="outline" className={className}>
        No Prepayment
      </Badge>
    )
  }

  const endDate = new Date(prepaymentInfo.endDate)
  const today = new Date()
  const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const isExpiringSoon = daysLeft <= 3 && daysLeft > 0

  return (
    <div className={`space-y-1 ${className}`}>
      <Badge
        className={`${
          isExpiringSoon
            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
            : "bg-blue-100 text-blue-800 border-blue-200"
        }`}
      >
        <CreditCard className="w-3 h-3 mr-1" />
        Prepaid
      </Badge>
      <div className="text-xs text-muted-foreground space-y-0.5">
        <div className="flex items-center">
          <span>₵{prepaymentInfo.amount.toFixed(2)}</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          <span>{daysLeft > 0 ? `${daysLeft} days left` : "Expired"}</span>
        </div>
        <div className="text-xs">Until {format(endDate, "MMM dd")}</div>
      </div>
    </div>
  )
}
