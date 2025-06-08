import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, Trash2 } from "lucide-react"
import Link from "next/link"

const proposals = [
  {
    id: "prop-1",
    title: "E-commerce Website Redesign",
    client: "Fashion Boutique",
    date: "2023-06-01",
    status: "Sent",
  },
  {
    id: "prop-2",
    title: "Custom WordPress Plugin",
    client: "Legal Firm",
    date: "2023-05-28",
    status: "Won",
  },
  {
    id: "prop-3",
    title: "Mobile App Development",
    client: "Health Startup",
    date: "2023-05-25",
    status: "Draft",
  },
  {
    id: "prop-4",
    title: "SEO Optimization",
    client: "Local Restaurant",
    date: "2023-05-20",
    status: "Lost",
  },
]

export default function RecentProposals() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Proposals</CardTitle>
        <CardDescription>View and manage your recent proposals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Title</th>
                <th className="text-left py-3 px-2">Client</th>
                <th className="text-left py-3 px-2">Date</th>
                <th className="text-left py-3 px-2">Status</th>
                <th className="text-right py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((proposal) => (
                <tr key={proposal.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2">
                    <Link href={`/dashboard/proposals/${proposal.id}`} className="font-medium hover:text-purple-600">
                      {proposal.title}
                    </Link>
                  </td>
                  <td className="py-3 px-2">{proposal.client}</td>
                  <td className="py-3 px-2">{new Date(proposal.date).toLocaleDateString()}</td>
                  <td className="py-3 px-2">
                    <Badge
                      variant={
                        proposal.status === "Won"
                          ? "success"
                          : proposal.status === "Lost"
                            ? "destructive"
                            : proposal.status === "Sent"
                              ? "default"
                              : "outline"
                      }
                    >
                      {proposal.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
