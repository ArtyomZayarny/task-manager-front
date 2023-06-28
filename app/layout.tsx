import { Modal } from "@/components/Modal";
import "./globals.css";
import { Inter } from "next/font/google";
import { AppContextProvider } from "@/context/app-context";
import AddTaskModal from "@/components/AddTaskModal";
import { TaskContextProvider } from "@/context/task-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppContextProvider>
          <TaskContextProvider>
            {children}
            <Modal />
            <AddTaskModal />
          </TaskContextProvider>
        </AppContextProvider>
      </body>
    </html>
  );
}