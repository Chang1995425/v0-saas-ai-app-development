import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function JobDescriptionAnalysis() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Key Requirements</CardTitle>
          <CardDescription>Important requirements extracted from the job description</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Experience & Skills</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-purple-50">
                  5+ years WordPress
                </Badge>
                <Badge variant="outline" className="bg-purple-50">
                  Custom theme development
                </Badge>
                <Badge variant="outline" className="bg-purple-50">
                  WooCommerce
                </Badge>
                <Badge variant="outline" className="bg-purple-50">
                  PHP
                </Badge>
                <Badge variant="outline" className="bg-purple-50">
                  JavaScript
                </Badge>
                <Badge variant="outline" className="bg-purple-50">
                  Responsive design
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Must-Have Requirements</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Portfolio of <span className="font-medium">at least 10</span> WordPress sites
                </li>
                <li>
                  <span className="font-medium">MUST</span> have WooCommerce experience
                </li>
                <li>
                  <span className="font-medium">SHOULD</span> be familiar with Elementor
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Project Type</h3>
              <p>
                E-commerce website for a <span className="font-medium">boutique clothing store</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Highlighted Keywords</CardTitle>
          <CardDescription>Important keywords and phrases to include in your proposal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Numbers & Metrics</h3>
              <div className="flex flex-wrap gap-2">
                <Badge>5+ years experience</Badge>
                <Badge>10+ portfolio sites</Badge>
                <Badge>3 revisions included</Badge>
                <Badge>4 week timeline</Badge>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Strong Words</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">MUST</Badge>
                <Badge variant="secondary">REQUIRED</Badge>
                <Badge variant="secondary">ESSENTIAL</Badge>
                <Badge variant="secondary">PROVEN TRACK RECORD</Badge>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Industry & Business Type</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Fashion retail</Badge>
                <Badge variant="outline">Boutique store</Badge>
                <Badge variant="outline">E-commerce</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
