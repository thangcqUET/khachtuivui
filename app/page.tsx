"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  Zap,
  DollarSign,
  Heart,
  Bell,
  Phone,
  CheckCircle,
  Star,
  Users,
  Clock,
  Wifi,
  Building,
  Check,
  X,
} from "lucide-react"
import { useActionState } from "react"
import { submitForm } from "./actions"
import { AuthButtons } from "@/components/auth-buttons"

export default function LandingPage() {
  const [state, action, isPending] = useActionState(submitForm, null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isPricingOpen, setIsPricingOpen] = useState(false)

  // Add effect to close form on successful submission
  useEffect(() => {
    if (state?.success) {
      setIsFormOpen(false)
    }
  }, [state])

  const pricingPlans = [
    {
      name: "Gói Khởi Nghiệp",
      price: "299,000",
      period: "tháng",
      description: "Phù hợp cho quán nhỏ, cà phê vỉa hè",
      popular: false,
      features: ["1 thiết bị IoT", "Tối đa 5 bàn", "Thông điệp cơ bản", "Hỗ trợ email", "Báo cáo hàng tháng"],
      notIncluded: ["Tùy chỉnh thông điệp", "Hỗ trợ 24/7", "Tích hợp POS"],
    },
    {
      name: "Gói Phổ Biến",
      price: "599,000",
      period: "tháng",
      description: "Lựa chọn tốt nhất cho quán cà phê, nhà hàng vừa",
      popular: true,
      features: [
        "2 thiết bị IoT",
        "Tối đa 15 bàn",
        "Thông điệp tùy chỉnh",
        "Hỗ trợ điện thoại",
        "Báo cáo chi tiết",
        "Phân tích khách hàng",
      ],
      notIncluded: ["Hỗ trợ 24/7", "Tích hợp POS"],
    },
    {
      name: "Gói Chuyên Nghiệp",
      price: "999,000",
      period: "tháng",
      description: "Dành cho nhà hàng lớn, chuỗi cửa hàng",
      popular: false,
      features: [
        "5 thiết bị IoT",
        "Không giới hạn bàn",
        "Thông điệp AI thông minh",
        "Hỗ trợ 24/7",
        "Dashboard quản lý",
        "Tích hợp POS",
        "Phân tích nâng cao",
      ],
      notIncluded: [],
    },
    {
      name: "Gói Doanh Nghiệp",
      price: "1,999,000",
      period: "tháng",
      description: "Giải pháp toàn diện cho chuỗi nhà hàng lớn",
      popular: false,
      features: [
        "Không giới hạn thiết bị",
        "Đa chi nhánh",
        "AI cá nhân hóa",
        "Quản lý tập trung",
        "API tích hợp",
        "Đào tạo nhân viên",
        "Hỗ trợ ưu tiên",
        "Báo cáo thời gian thực",
      ],
      notIncluded: [],
    },
    {
      name: "Gói Tùy Chỉnh",
      price: "Liên hệ",
      period: "",
      description: "Giải pháp riêng biệt theo yêu cầu đặc biệt",
      popular: false,
      features: [
        "Thiết kế theo yêu cầu",
        "Tích hợp đặc biệt",
        "Hỗ trợ kỹ thuật riêng",
        "SLA cam kết",
        "Đào tạo chuyên sâu",
        "Bảo trì ưu tiên",
      ],
      notIncluded: [],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-800">Khách Tui Vui</span>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={isPricingOpen} onOpenChange={setIsPricingOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="hidden md:flex">
                    Xem Bảng Giá
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-center text-2xl mb-4">Bảng Giá Khách Tui Vui</DialogTitle>
                    <p className="text-center text-gray-600 mb-6">
                      Chọn gói phù hợp với quy mô và nhu cầu của quán bạn
                    </p>
                  </DialogHeader>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pricingPlans.map((plan, index) => (
                      <Card
                        key={index}
                        className={`relative border-2 ${
                          plan.popular ? "border-blue-500 shadow-lg scale-105" : "border-gray-200 hover:border-blue-300"
                        } transition-all duration-300`}
                      >
                        {plan.popular && (
                          <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1">
                            Phổ biến nhất
                          </Badge>
                        )}
                        <CardHeader className="text-center pb-4">
                          <CardTitle className="text-xl font-bold text-gray-800">{plan.name}</CardTitle>
                          <div className="mt-2">
                            <span className="text-3xl font-bold text-blue-600">{plan.price}</span>
                            {plan.period && <span className="text-gray-500">đ/{plan.period}</span>}
                          </div>
                          <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                                <Check className="h-4 w-4 mr-1" />
                                Bao gồm:
                              </h4>
                              <ul className="space-y-1">
                                {plan.features.map((feature, featureIndex) => (
                                  <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                                    <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {plan.notIncluded.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-500 mb-2 flex items-center">
                                  <X className="h-4 w-4 mr-1" />
                                  Không bao gồm:
                                </h4>
                                <ul className="space-y-1">
                                  {plan.notIncluded.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-center text-sm text-gray-400">
                                      <X className="h-3 w-3 text-gray-400 mr-2 flex-shrink-0" />
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          <Button
                            className={`w-full mt-6 ${
                              plan.popular
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                            }`}
                            onClick={() => {
                              setIsPricingOpen(false)
                              setIsFormOpen(true)
                            }}
                          >
                            {plan.price === "Liên hệ" ? "Liên hệ tư vấn" : "Chọn gói này"}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="mt-6 text-center text-sm text-gray-500">
                    <p>💡 Tất cả gói đều bao gồm setup miễn phí và hỗ trợ kỹ thuật ban đầu</p>
                    <p>
                      📞 Liên hệ để được tư vấn gói phù hợp nhất: <strong>1900-XXX-XXX</strong>
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
              <AuthButtons />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Truyền tải thông điệp tới khách hàng của bạn cùng <span className="text-blue-600">Khách Tui Vui</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 italic leading-relaxed">
              "Lời nói chẳng mất tiền mua –<br />
              Lựa lời mà nói cho vừa lòng nhau"
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Thử ngay và luôn
                    <MessageCircle className="ml-2 h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl">Đăng ký dùng thử Khách Tui Vui</DialogTitle>
                  </DialogHeader>
                  <form action={action} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Họ và tên *</Label>
                      <Input id="name" name="name" required placeholder="Nguyễn Văn A" disabled={isPending} />
                    </div>
                    <div>
                      <Label htmlFor="business">Tên quán/cửa hàng *</Label>
                      <Input
                        id="business"
                        name="business"
                        required
                        placeholder="Quán cà phê ABC"
                        disabled={isPending}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input id="phone" name="phone" required placeholder="0901234567" disabled={isPending} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="email@example.com"
                        disabled={isPending}
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Ghi chú</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Mô tả thêm về quán của bạn..."
                        rows={3}
                        disabled={isPending}
                      />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isPending}>
                      {isPending ? "Đang gửi..." : "Đăng ký ngay"}
                    </Button>
                  </form>

                  {/* Add success/error messages */}
                  {state && (
                    <div
                      className={`mt-4 p-3 rounded-md text-center ${
                        state.success
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {state.success ? state.message : state.error}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 text-center">Bấm phát là chúng tôi sắp lịch cho bạn luôn á! 🚀</p>
                </DialogContent>
              </Dialog>

              <Dialog open={isPricingOpen} onOpenChange={setIsPricingOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Xem Bảng Giá
                    <DollarSign className="ml-2 h-5 w-5" />
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>

            <p className="text-sm text-gray-500 mt-4">✨ Bấm phát là chúng tôi sắp lịch cho bạn luôn á</p>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-8 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="flex justify-center items-center space-x-8 md:space-x-16">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-red-500" />
              <span className="font-semibold text-gray-700">Thấu hiểu</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-yellow-500" />
              <span className="font-semibold text-gray-700">Đơn giản</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-6 w-6 text-blue-500" />
              <span className="font-semibold text-gray-700">Chất lượng</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">Tính năng nổi bật</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Bell className="h-8 w-8 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">Nhắc nhở thông minh</h3>
                    <p className="text-gray-600">
                      Nhắc nhở khách mua thêm một cách tế nhị nếu họ ngồi quá lâu, không làm phiền mà vẫn tăng doanh
                      thu.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Phone className="h-8 w-8 text-green-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">Gọi nhân viên dễ dàng</h3>
                    <p className="text-gray-600">
                      Khách hàng chủ động gọi nhân viên một cách dễ dàng, không cần phải gọi to hay ra hiệu thủ công.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Tại sao chọn Khách Tui Vui?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Giao tiếp tinh tế</h3>
                <p className="text-gray-600">
                  Truyền tải thông điệp đến khách hàng một cách tự nhiên, lịch sự và đầy tinh tế, tạo trải nghiệm tuyệt
                  vời.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Triển khai siêu tốc</h3>
                <p className="text-gray-600">
                  Chỉ 15 phút setup, thao tác đơn giản như bấm nút. Từ ông bà đến gen Z đều dùng được dễ dàng.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <DollarSign className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Giá cả hợp lý</h3>
                <p className="text-gray-600">
                  Chi phí siêu tiết kiệm, phù hợp túi tiền từ quán vỉa hè đến chuỗi nhà hàng lớn.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Hỗ trợ tận tâm</h3>
                <p className="text-gray-600">
                  Đội ngũ nhiệt huyết, sẵn sàng đồng hành 24/7. Có vấn đề gì là chúng tôi lo liền!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">Câu hỏi thường gặp</h2>
          <div className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Khách Tui Vui hoạt động như thế nào?
                </h3>
                <p className="text-gray-600 ml-7">
                  Hệ thống sử dụng thiết bị IoT đặt tại quán để gửi thông điệp thân thiện tới khách hàng một cách tự
                  động và thông minh.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
                  <Clock className="h-5 w-5 text-blue-500 mr-2" />
                  Cần bao lâu để setup?
                </h3>
                <p className="text-gray-600 ml-7">
                  Chỉ cần 15 phút. Đội ngũ của chúng tôi sẽ hỗ trợ bạn từ A–Z, đảm bảo mọi thứ hoạt động mượt mà.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
                  <Users className="h-5 w-5 text-purple-500 mr-2" />
                  Khách hàng có cảm thấy phiền không?
                </h3>
                <p className="text-gray-600 ml-7">
                  Không hề. Các thông điệp được thiết kế để thân thiện, lịch sự và tôn trọng trải nghiệm khách hàng.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
                  <Wifi className="h-5 w-5 text-orange-500 mr-2" />
                  Có cần kết nối internet không?
                </h3>
                <p className="text-gray-600 ml-7">
                  Có, nhưng chỉ cần mạng wifi cơ bản là đủ hoạt động ổn định. Không cần băng thông cao.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
                  <Building className="h-5 w-5 text-red-500 mr-2" />
                  Tôi có thể dùng cho nhiều bàn/quán cùng lúc không?
                </h3>
                <p className="text-gray-600 ml-7">
                  Có. Chúng tôi hỗ trợ thiết lập cho từng vị trí cụ thể một cách linh hoạt, phù hợp với mọi quy mô.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Sẵn sàng cải thiện trải nghiệm khách hàng?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Hãy để Khách Tui Vui giúp bạn giao tiếp với khách hàng một cách tinh tế và hiệu quả
          </p>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Bắt đầu ngay hôm nay
                <MessageCircle className="ml-2 h-5 w-5" />
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <MessageCircle className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold">Khách Tui Vui</span>
          </div>
          <p className="text-gray-400 mb-4">Giải pháp IoT thông minh cho giao tiếp khách hàng</p>
          <p className="text-sm text-gray-500">© 2024 Khách Tui Vui. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  )
}
