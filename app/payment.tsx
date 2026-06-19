import AmazonPayLogo from "@/assets/logos/others/amazon_pay.svg";
import ApplePayLogo from "@/assets/logos/others/apple_pay.svg";
import MyBankLogo from "@/assets/logos/others/mybank.svg";
import PaypalLogo from "@/assets/logos/others/paypal.svg";
import SatispayLogo from "@/assets/logos/others/satispay.svg";
import { CheckoutHeader } from "@/components/checkout-header";
import { StickyFooter } from "@/components/select-offer/sticky-footer";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, ScrollView, Switch, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PaymentScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const endTime = Number(params.endTime);
  const totalPrice = parseFloat((params.price as string) || "61.60");

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [invoiceRequested, setInvoiceRequested] = useState(false);
  const [isOtherMethodsOpen, setIsOtherMethodsOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const renderSelectedLogo = () => {
    switch (selectedMethod) {
      case "paypal":
        return (
          <PaypalLogo
            width={80}
            height={24}
            preserveAspectRatio="xMinYMid meet"
          />
        );
      case "apple_pay":
        return (
          <ApplePayLogo
            width={64}
            height={20}
            preserveAspectRatio="xMinYMid meet"
          />
        );
      case "satispay":
        return (
          <SatispayLogo
            width={80}
            height={24}
            preserveAspectRatio="xMinYMid meet"
          />
        );
      case "amazon_pay":
        return (
          <AmazonPayLogo
            width={80}
            height={24}
            preserveAspectRatio="xMinYMid meet"
          />
        );
      case "mybank":
        return (
          <MyBankLogo
            width={90}
            height={28}
            preserveAspectRatio="xMinYMid meet"
          />
        );
      default:
        return (
          <ThemedText className="text-[15px] font-google-sans-semibold !text-gray-950">
            Altri metodi di pagamento
          </ThemedText>
        );
    }
  };

  return (
    <View className="flex-1 bg-[#f3f4f6]">
      <Stack.Screen options={{ headerShown: false }} />
      <CheckoutHeader title="Pagamento" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Credito elettronico */}
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/electronic-credit" as any,
              params: { endTime },
            })
          }
          className="bg-white px-5 py-4 flex-row items-center justify-between mb-2"
        >
          <View className="flex-row items-center flex-1">
            <Icon
              name="redeem"
              size={24}
              color="#134e4a"
              className="mr-3"
              weight={300}
            />
            <View className="flex-1">
              <ThemedText className="text-[15px] font-google-sans-bold !text-gray-950">
                Credito elettronico, carta regalo o bonus
              </ThemedText>
              <ThemedText className="text-[13px] font-google-sans-medium !text-gray-500 mt-0.5">
                Hai crediti disponibili
              </ThemedText>
            </View>
          </View>
          <View className="ml-2">
            <Icon name="add" size={24} color="#4b5563" />
          </View>
        </Pressable>

        <Animated.View
          layout={LinearTransition}
          className="bg-white flex-1 pt-6"
        >
          {/* Pagamento */}
          <View className="px-5 mb-4">
            <ThemedText className="text-[17px] font-google-sans-bold !text-gray-950">
              Pagamento
            </ThemedText>
          </View>

          {/* Metodi di pagamento Cards */}
          <View className="px-5 gap-4">
            <View className="gap-2">
              <ThemedText className="text-[13px] font-google-sans-medium !text-gray-500 uppercase">
                METODI SALVATI
              </ThemedText>
              {/* Card 1: Carte di credito */}
              <Pressable
                className={`min-h-[60px] rounded-2xl border p-4 flex-row items-center justify-between ${selectedMethod === "card" ? "border-primary-600 bg-primary-600/5" : "border-gray-200 bg-white/5"}`}
                onPress={() => setSelectedMethod("card")}
              >
                <View className="flex-row items-center">
                  <ThemedText className="text-[15px] font-google-sans-semibold !text-gray-950">
                    Carta di debito o credito
                  </ThemedText>
                </View>
                <View
                  className={`h-5 w-5 rounded-full border-2 items-center justify-center ${selectedMethod === "card" ? "border-primary-600" : "border-gray-300"}`}
                >
                  {selectedMethod === "card" && (
                    <View className="h-2.5 w-2.5 rounded-full bg-primary-600" />
                  )}
                </View>
              </Pressable>
            </View>

            {/* Card 2: Altri metodi */}
            <View className="gap-2">
              <ThemedText className="text-[13px] font-google-sans-medium !text-gray-500 uppercase">
                ALTRI METODI
              </ThemedText>

              <AnimatedPressable
                layout={LinearTransition}
                className={`rounded-2xl border p-4 overflow-hidden ${selectedMethod !== "card" ? "border-primary-600" : "border-gray-200"} ${selectedMethod !== "card" && !isOtherMethodsOpen ? "bg-primary-600/5" : "bg-white/5"} transition-colors duration-300`}
                onPress={() => setIsOtherMethodsOpen(!isOtherMethodsOpen)}
              >
                <View
                  className={`flex-row items-center justify-between min-h-[28px] ${isOtherMethodsOpen ? "mb-3" : ""}`}
                >
                  {renderSelectedLogo()}
                  <Icon
                    name={isOtherMethodsOpen ? "expand_less" : "expand_more"}
                    size={24}
                    color="#4b5563"
                  />
                </View>

                {isOtherMethodsOpen && (
                  <Animated.View
                    entering={FadeIn}
                    exiting={FadeOut}
                    className="flex-col gap-5 mt-1 pt-4 border-t border-gray-100"
                  >
                    {/* PayPal */}
                    <Pressable
                      className="flex-row items-center justify-between"
                      onPress={() => {
                        setSelectedMethod("paypal");
                        setIsOtherMethodsOpen(false);
                      }}
                    >
                      <View className="flex-row items-center">
                        <PaypalLogo
                          width={80}
                          height={24}
                          preserveAspectRatio="xMinYMid meet"
                        />
                      </View>
                      <View
                        className={`h-5 w-5 rounded-full border-2 items-center justify-center ${selectedMethod === "paypal" ? "border-primary-600" : "border-gray-300"}`}
                      >
                        {selectedMethod === "paypal" && (
                          <View className="h-2.5 w-2.5 rounded-full bg-primary-600" />
                        )}
                      </View>
                    </Pressable>

                    {/* Apple Pay */}
                    <Pressable
                      className="flex-row items-center justify-between"
                      onPress={() => {
                        setSelectedMethod("apple_pay");
                        setIsOtherMethodsOpen(false);
                      }}
                    >
                      <View className="flex-row items-center">
                        <ApplePayLogo
                          width={64}
                          height={20}
                          preserveAspectRatio="xMinYMid meet"
                        />
                      </View>
                      <View
                        className={`h-5 w-5 rounded-full border-2 items-center justify-center ${selectedMethod === "apple_pay" ? "border-primary-600" : "border-gray-300"}`}
                      >
                        {selectedMethod === "apple_pay" && (
                          <View className="h-2.5 w-2.5 rounded-full bg-primary-600" />
                        )}
                      </View>
                    </Pressable>

                    {/* Satispay */}
                    <Pressable
                      className="flex-row items-center justify-between"
                      onPress={() => {
                        setSelectedMethod("satispay");
                        setIsOtherMethodsOpen(false);
                      }}
                    >
                      <View className="flex-row items-center">
                        <SatispayLogo
                          width={80}
                          height={24}
                          preserveAspectRatio="xMinYMid meet"
                        />
                      </View>
                      <View
                        className={`h-5 w-5 rounded-full border-2 items-center justify-center ${selectedMethod === "satispay" ? "border-primary-600" : "border-gray-300"}`}
                      >
                        {selectedMethod === "satispay" && (
                          <View className="h-2.5 w-2.5 rounded-full bg-primary-600" />
                        )}
                      </View>
                    </Pressable>

                    {/* Amazon Pay */}
                    <Pressable
                      className="flex-row items-center justify-between"
                      onPress={() => {
                        setSelectedMethod("amazon_pay");
                        setIsOtherMethodsOpen(false);
                      }}
                    >
                      <View className="flex-row items-center">
                        <AmazonPayLogo
                          width={80}
                          height={24}
                          preserveAspectRatio="xMinYMid meet"
                        />
                      </View>
                      <View
                        className={`h-5 w-5 rounded-full border-2 items-center justify-center ${selectedMethod === "amazon_pay" ? "border-primary-600" : "border-gray-300"}`}
                      >
                        {selectedMethod === "amazon_pay" && (
                          <View className="h-2.5 w-2.5 rounded-full bg-primary-600" />
                        )}
                      </View>
                    </Pressable>

                    {/* MyBank */}
                    <Pressable
                      className="flex-row items-center justify-between"
                      onPress={() => {
                        setSelectedMethod("mybank");
                        setIsOtherMethodsOpen(false);
                      }}
                    >
                      <View className="flex-row items-center">
                        <MyBankLogo
                          width={90}
                          height={28}
                          preserveAspectRatio="xMinYMid meet"
                        />
                      </View>
                      <View
                        className={`h-5 w-5 rounded-full border-2 items-center justify-center ${selectedMethod === "mybank" ? "border-primary-600" : "border-gray-300"}`}
                      >
                        {selectedMethod === "mybank" && (
                          <View className="h-2.5 w-2.5 rounded-full bg-primary-600" />
                        )}
                      </View>
                    </Pressable>
                  </Animated.View>
                )}
              </AnimatedPressable>
            </View>
          </View>

					<Animated.View layout={LinearTransition}>
						{/* Fattura */}
						<View className="px-5 mt-8 mb-6 flex-row items-center justify-between">
							<View className="flex-row items-center">
								<ThemedText className="text-[15px] font-google-sans-medium !text-gray-950 mr-1.5">
									Voglio la fattura
								</ThemedText>
								<Icon name="info" size={16} color="#9ca3af" />
							</View>
							<View
								className={
									Platform.OS === "ios" ? "bg-gray-200 rounded-full" : ""
								}
							>
								<Switch
									value={invoiceRequested}
									onValueChange={setInvoiceRequested}
									trackColor={{ false: "#e5e7eb", true: "#006666" }}
									thumbColor={"#ffffff"}
									className={Platform.OS === "ios" ? "-mr-0.5" : ""}
								/>
							</View>
						</View>

            {/* Terms */}
            <View className="px-5 mb-8">
              <View className="flex-row items-start mb-3">
                <Pressable
                  onPress={() => setAcceptedTerms(!acceptedTerms)}
                  className={`h-5 w-5 rounded items-center justify-center border mt-0.5 mr-3 ${
                    acceptedTerms
                      ? "bg-primary-600 border-primary-600"
                      : "border-gray-400"
                  }`}
                >
                  {acceptedTerms && (
                    <Icon
                      name="check"
                      size={16}
                      color="white"
                      weight={600}
                      style={{ marginTop: -2 }}
                    />
                  )}
                </Pressable>
                <ThemedText className="flex-1 text-[13px] font-google-sans-medium !text-gray-600 leading-tight">
                  Accetto le{" "}
                  <ThemedText className="!text-[#c1152c] underline">
                    condizioni di trasporto
                  </ThemedText>{" "}
                  del vettore ed ho preso visione dell&apos;informativa per la{" "}
                  <ThemedText className="!text-[#c1152c] underline">
                    protezione dei dati personali
                  </ThemedText>
                  .
                </ThemedText>
              </View>

              <View className="ml-8 mb-2">
                <ThemedText className="text-[13px] font-google-sans-medium !text-gray-600">
                  Stai acquistando un biglietto cumulativo.{"\n"}
                  <ThemedText className="!text-[#c1152c] underline">
                    Maggiori info
                  </ThemedText>
                </ThemedText>
              </View>

              <View className="ml-8">
                <ThemedText className="text-[13px] font-google-sans-medium !text-gray-600">
                  Consulta le modifiche alla circolazione.
                </ThemedText>
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </ScrollView>

      <StickyFooter
        totalPrice={totalPrice}
        basePrice={0}
        buttonTitle={isProcessing ? "Elaborazione" : "Paga ora"}
        isLoading={isProcessing}
        subtitle="Totale"
        hideSeatSelection={true}
        disabled={!acceptedTerms || isProcessing}
        onPress={() => {
          setIsProcessing(true);
          setTimeout(() => {
            router.replace({
              pathname: "/payment-success" as any,
              params: { isAddService: params.isAddService },
            });
          }, 3500);
        }}
      />
    </View>
  );
}
