import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import MailAnimation from "./MailAnimation";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("contactFormData");
    if (savedData) setFormData(JSON.parse(savedData));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    localStorage.setItem("contactFormData", JSON.stringify(newData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus({ type: "error", message: "Please fill in all fields" });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      await emailjs.send(
        "service_r6mccha",
        "template_txx5tat",
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        "qoK7ywQ9F9pO_P1MY"
      );

      setStatus({ type: "success", message: "Message sent successfully!" });
      setFormData({ name: "", email: "", subject: "", message: "" });
      localStorage.removeItem("contactFormData");
    } catch (error) {
      setStatus({ type: "error", message: "Failed to send message. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative bg-transparent overflow-hidden">
      
      <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-dandy-300/20 rounded-full blur-[150px] -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl ape-heading text-glow mb-4 text-dandy-950">
            GET IN TOUCH
          </h2>
          <p className="text-dandy-600 text-lg font-sans uppercase tracking-widest">Let's work together on your next project</p>
        </motion.div>

        {/* FORM + ANIMATION */}
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* FORM */}
          <motion.form
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="glass-card p-10 border-stone-900/10 shadow-[0_0_50px_rgba(28,17,8,0.03)] relative overflow-hidden tilt-3d"
          >
             <div className="absolute inset-0 bg-dandy-500/5 pointer-events-none" />
             
            <div className="relative z-10">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-dandy-800 font-sans tracking-wider uppercase text-sm font-semibold">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-dandy-950/5 border border-dandy-950/10 rounded-xl text-dandy-950 placeholder-dandy-950/30 focus:outline-none focus:border-dandy-900 focus:bg-white transition-all font-sans"
                    placeholder="Your Name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-dandy-800 font-sans tracking-wider uppercase text-sm font-semibold">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-dandy-950/5 border border-dandy-950/10 rounded-xl text-dandy-950 placeholder-dandy-950/30 focus:outline-none focus:border-dandy-900 focus:bg-white transition-all font-sans"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <label className="text-dandy-800 font-sans tracking-wider uppercase text-sm font-semibold">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-dandy-950/5 border border-dandy-950/10 rounded-xl text-dandy-950 placeholder-dandy-950/30 focus:outline-none focus:border-dandy-900 focus:bg-white transition-all font-sans"
                  placeholder="Project Inquiry"
                />
              </div>

              <div className="space-y-2 mb-8">
                <label className="text-dandy-800 font-sans tracking-wider uppercase text-sm font-semibold">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-5 py-4 bg-dandy-950/5 border border-dandy-950/10 rounded-xl text-dandy-950 placeholder-dandy-950/30 focus:outline-none focus:border-dandy-900 focus:bg-white transition-all resize-none font-sans"
                  placeholder="Tell me about your project..."
                />
              </div>

              {status.message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 p-4 rounded-xl flex items-center space-x-3 font-sans font-medium text-sm ${
                    status.type === "success"
                      ? "bg-green-500/10 border border-green-500/30 text-green-600"
                      : "bg-red-500/10 border border-red-500/30 text-red-600"
                  }`}
                >
                  {status.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                  <span>{status.message}</span>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-8 py-5 bg-dandy-950 text-white rounded-xl font-sans font-semibold uppercase tracking-widest text-xl flex items-center justify-center space-x-3 hover:bg-dandy-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(28,17,8,0.15)]"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    <span>SENDING...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>SEND MESSAGE</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>

          {/* MAIL ANIMATION */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center mix-blend-screen opacity-80"
          >
            <MailAnimation />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;