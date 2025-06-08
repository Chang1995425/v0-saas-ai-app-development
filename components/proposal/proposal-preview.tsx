import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Copy, Edit } from "lucide-react"

export default function ProposalPreview() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Generated Proposal</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button size="sm" variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="prose max-w-none">
            <h3>Custom WooCommerce Solution for Your Boutique Fashion Store</h3>

            <p>
              <strong>
                As a WordPress developer with over 7 years of experience specializing in WooCommerce and custom theme
                development
              </strong>
              , I'm excited about the opportunity to create a stunning online presence for your boutique clothing store.
            </p>

            <p>
              Your requirement for a developer with <strong>5+ years of WordPress experience</strong> and a{" "}
              <strong>proven track record with WooCommerce</strong> aligns perfectly with my expertise. I've
              successfully delivered <strong>15+ e-commerce projects</strong> for fashion retailers, focusing on
              beautiful design, intuitive shopping experiences, and robust backend systems.
            </p>

            <h4>Technical Approach:</h4>

            <ol>
              <li>
                <strong>Custom Theme Development:</strong> I'll create a bespoke WordPress theme that perfectly captures
                your boutique's unique aesthetic, ensuring your online presence stands out from template-based
                competitors.
              </li>
              <li>
                <strong>WooCommerce Integration:</strong> Full implementation of WooCommerce with custom product
                displays, size guides, and product filtering optimized for fashion retail.
              </li>
              <li>
                <strong>Mobile-First Responsive Design:</strong> Your store will provide a seamless shopping experience
                across all devices, with special attention to mobile checkout optimization.
              </li>
              <li>
                <strong>Elementor Pro:</strong> I'll leverage Elementor's capabilities for easy content management while
                extending it with custom code where needed for unique functionality.
              </li>
            </ol>

            <h4>Project Timeline:</h4>

            <ul>
              <li>Discovery & Design: 1 week</li>
              <li>Development & WooCommerce Setup: 2 weeks</li>
              <li>Testing & Refinement: 1 week</li>
              <li>
                Total: <strong>4 weeks</strong> to launch
              </li>
            </ul>

            <p>
              I've recently completed a similar project for Modish Boutique, a women's clothing store, where we
              increased their online sales by 45% within three months of launch through an intuitive shopping experience
              and optimized mobile checkout process.
            </p>

            <p>
              I'd be happy to discuss your project in more detail and share my portfolio featuring similar fashion
              e-commerce sites I've developed. When would be a good time for a quick call this week?
            </p>

            <p>
              Looking forward to the possibility of creating an exceptional online shopping experience for your
              boutique.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
