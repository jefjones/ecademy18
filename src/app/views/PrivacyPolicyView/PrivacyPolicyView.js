import React, {Component} from 'react';
import {Link} from 'react-router';
import styles from './PrivacyPolicyView.css';
import globalStyles from '../../utils/globalStyles.css';
import Logo from '../../assets/logos/eCADEMYapp_Logo_vertical.png';
import OneFJefFooter from '../../components/OneFJefFooter';

export default class PrivacyPolicyView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
	    }
  }

  render() {
    return (
				<div className={styles.container}>
						<Link className={styles.topLogo} to={'/'}>
								<img src={Logo} className={styles.logo} alt={`5 Star LMS`} />
						</Link>
						<div className={globalStyles.pageTitle}>
								{'Privacy Policy'}
						</div>
						<br/>
						<br/>
						<p className={styles.MsoNormal}><b><span
						>Introduction</span></b></p>

						<p className={styles.MsoNormal}><span
						>This
						privacy policy will help you understand what information we collect and use at <i>one
						f Jef, Inc.</i>, and the choices you have associated with that information.
						When we refer to "<i>one f Jef, Inc.</i>," "we," "our," or "us" in this policy,
						we are referring to <i>one f Jef, Inc.<b>,</b></i>&nbsp;and its subsidiaries
						and affiliates, which provides the Services to you. The "Services" refers to
						the applications, services, and websites (marketing and product) provided by <i>one
						f Jef, Inc.</i>. <i>one f Jef, Inc.</i> may, from time to time, introduce new
						products and services. To the extent that these new products and services
						affect this policy, we will notify you as described in Section 8 below. This
						privacy policy covers the digital properties 5starLMS.com, Penspring.com, one-fJef.com. The use of information
						collected through our service shall be limited to the purpose of providing the
						services for our customers and as specified herein.</span></p>

						<p className={styles.MsoNormal}><b><u><span
						>Contents:</span></u></b></p>

						<ol>
						 <li className={styles.MsoNormal} ><b><span
						     >Information We
						     Collect and Receive</span></b></li>
						 <li className={styles.MsoNormal} ><b><span
						     >How We Use the
						     Information We Collect and Receive</span></b></li>
						 <li className={styles.MsoNormal} ><b><span
						     >Analytics,
						     Cookies and Other Web Site Technologies</span></b></li>
						 <li className={styles.MsoNormal} ><b><span
						     >Information
						     Sharing</span></b></li>
						 <li className={styles.MsoNormal} ><b><span
						     >Communicating</span></b></li>
						 <li className={styles.MsoNormal} ><b><span
						     >Accessing Your
						     Data</span></b></li>
						 <li className={styles.MsoNormal} ><b><span
						     >Security</span></b></li>
						 <li className={styles.MsoNormal} ><b><span
						     >Changes to
						     this Statement/Contact Us</span></b></li>
						</ol>

						<p className={styles.MsoNormal} ><b><span >1. Information We Collect and Receive</span></b></p>

						<p className={styles.MsoNormal}><span
						>We
						collect several different types of information to provide Services to you,
						including:</span></p>

						<p className={styles.MsoNormal}><b><span
						>Customer
						Account and Registration Data:</span></b><span >&nbsp;This includes
						information you provide to create your account with us which may include, first
						and last name, billing information, a password and a valid email address.</span></p>

						<p className={styles.MsoNormal}><b><span
						>Service
						Data (including Session and Usage data):</span></b></p>

						<p className={styles.MsoNormal}><span
						>When
						you use our Services, we receive information generated through the use of the
						Service, either entered by you or others who use the Services with you (for
						example, schedules, attendee info, etc.), or from the Service infrastructure
						itself, (for example, duration of session, use of webcams, connection
						information, etc.)&nbsp; We may also collect usage and log data about how the
						services are accessed and used, including information about the device you are
						using the Services on, IP addresses, location information, language settings,
						what operating system you are using, unique device identifiers and other
						diagnostic data to help us support the Services.</span></p>

						<p className={styles.MsoNormal}><b><span
						>Third
						Party Data:</span></b><span >&nbsp;We may receive information about you from other sources,
						including publicly available databases or third parties from whom we have
						purchased data, and combine this data with information we already have about
						you. We may also receive information from other affiliated companies that are a
						part of our corporate group. This helps us to update, expand and analyze our
						records, identify new prospects for marketing, and provide products and
						services that may be of interest to you.&nbsp;</span></p>

						<p className={styles.MsoNormal}><b><span
						>Location
						Information:&nbsp;</span></b><span >We collect your location-based information for the purpose of
						providing and supporting the service and for fraud prevention and security
						monitoring. If you wish to opt-out of the collection and use of your collection
						information, you may do so by turning it off on your device settings.</span></p>

						<p className={styles.MsoNormal}><b><span
						>Device
						Information:&nbsp;</span></b><span >When you use our Services, we automatically collect information
						on the type of device you use, operating system version, and the device
						identifier (or &quot;UDID&quot;).</span></p>

						<p className={styles.MsoNormal} ><b><span >2. How We Use the Information We Collect and
						Receive</span></b></p>

						<p className={styles.MsoNormal}><i><span
						>one f
						Jef, Inc.</span></i><span > may access (which may include, with your consent, limited
						viewing or listening) and use the data we collect as necessary (a) to provide
						and maintain the Services; (b) to address and respond to service, security, and
						customer support issues; (c) to detect, prevent, or otherwise address fraud,
						security, unlawful, or technical issues; (d) as required by law; (e) to fulfill
						our contracts; (f) to improve and enhance the Services; (g) to provide analysis
						or valuable information back to our Customers and users.</span></p>

						<p className={styles.MsoNormal}><span
						>Some
						specific examples of how we use the information:</span></p>

						<ul type={'disc'}>
						 <li className={styles.MsoNormal} ><span
						     >Create and
						     administer your account</span></li>
						 <li className={styles.MsoNormal} ><span
						     >Send you an
						     order confirmation</span></li>
						 <li className={styles.MsoNormal} ><span
						     >Facilitate and
						     improve the usage of the services you have ordered</span></li>
						 <li className={styles.MsoNormal} ><span
						     >Assess the
						     needs of your business to determine suitable products</span></li>
						 <li className={styles.MsoNormal} ><span
						     >Send you
						     product updates, marketing communication, and service information</span></li>
						 <li className={styles.MsoNormal} ><span
						     >Respond to
						     customer inquiries and support requests</span></li>
						 <li className={styles.MsoNormal} ><span
						     >Conduct
						     research and analysis</span></li>
						 <li className={styles.MsoNormal} ><span
						     >Display
						     content based upon your interests</span></li>
						 <li className={styles.MsoNormal} ><span
						     >Analyze data,
						     including through automated systems and machine learning to improve our
						     services and/or your experience</span></li>
						 <li className={styles.MsoNormal} ><span
						     >Provide you
						     information about your use of the services and benchmarks, insights and
						     suggestions for improvements</span></li>
						 <li className={styles.MsoNormal} ><span
						     >Market
						     services of our third-party business partners</span></li>
						</ul>

						<p className={styles.MsoNormal}><i><span
						>one f
						Jef, Inc.</span></i><span > also collects and stores meeting attendee information to
						fulfill our obligation to our customers and provide the Services. With their
						consent, we may also directly provide product and other <i>one f Jef, Inc.</i>
						related information to attendees. <i>one f Jef, Inc.</i> will retain your information
						as long as your account with us is active, to comply with our legal
						obligations, to resolve disputes, and enforce our agreements.</span></p>

						<p className={styles.MsoNormal}><span
						>If
						you wish to cancel your account or for us to stop providing you services, or if
						we hold personal information about you and you want it to be removed from our
						database or inactivated, please&nbsp;</span><u><span ><a className={styles.link}
						href="mailto:support@ecademy.app"><span >contact us</span></a></span></u><span
						>&nbsp;here.</span></p>

						<p className={styles.MsoNormal} ><b><span >3. Analytics, Cookies and Other Web Site
						Technologies</span></b></p>

						<p className={styles.MsoNormal}><i><span
						>one f
						Jef, Inc.</span></i><span > is continuously improving our websites and products through the
						use of various third party web analytics tools, which help us understand how
						visitors use our websites, desktop tools, and mobile applications, what they
						like and dislike, and where they may have problems. While we maintain ownership
						of this data, we do not share this type of data about individual users with
						third parties.</span></p>

						<p className={styles.MsoNormal}><span
						>Geolocation
						and Other Data:</span></p>

						<p className={styles.MsoNormal}><span
						>We
						may utilize precise Geolocation data but only if you specifically opt-in to
						collection of that data in connection with a particular service. We also use
						information such as IP addresses to determine the general geographic locations
						areas of our visitors. The web beacons used in conjunction with these web
						analytics tools may gather data such as what browser or operating system a
						person uses, as well as, domain names, MIME types, and what content, products
						and services are reviewed or downloaded when visiting or registering for
						services at one of our websites or using one of our mobile applications.</span></p>

						<p className={styles.MsoNormal}><span
						>Social
						Media: Our sites include social media features, such as Facebook, Google and
						Twitter "share" buttons. These features may collect your IP address, which page
						you are visiting on our site, and may set a cookie to enable the feature to
						function properly. These services will also authenticate your identity and
						provide you the option to share certain personal information with us such as
						your name and email address to pre-populate our sign-up form or provide
						feedback. Your interactions with these features are governed by the privacy
						policy of the company providing them.</span></p>

						<p className={styles.MsoNormal} ><b><span >4. Information Sharing</span></b></p>

						<p className={styles.MsoNormal}><span
						>Ensuring
						your privacy is important to us. We do not share your personal information with
						third parties except as described in this privacy policy. We may share your
						personal information with (a) third party service providers; (b) business
						partners; (c) affiliated companies within our corporate structure and (d) as
						needed for legal purposes. Third party service providers have access to
						personal information only as needed to perform their functions and they must
						process the personal information in accordance with this Privacy Policy.</span></p>

						<p className={styles.MsoNormal}><span
						>Examples
						of how we may share information with service providers include:</span></p>

						<ul type={'disc'}>
						 <li className={styles.MsoNormal} ><span
						     >Fulfilling
						     orders and providing the services</span></li>
						 <li className={styles.MsoNormal} ><span
						     >Payment
						     processing and fraud prevention</span></li>
						 <li className={styles.MsoNormal} ><span
						     >Providing
						     customer support</span></li>
						 <li className={styles.MsoNormal} ><span
						     >Sending
						     marketing communications</span></li>
						 <li className={styles.MsoNormal} ><span
						     >Conducting
						     research and analysis</span></li>
						 <li className={styles.MsoNormal} ><span
						     >Providing
						     cloud computing infrastructure</span></li>
						</ul>

						<p className={styles.MsoNormal}><span
						>Examples
						of how we may disclose data for legal reasons include:</span></p>

						<ul type={'disc'}>
						 <li className={styles.MsoNormal} ><span
						     >As part of a
						     merger, sale of company assets, financing or acquisition of all or a
						     portion of our business by another company where customer information will
						     be one of the transferred assets.</span></li>
						 <li className={styles.MsoNormal} ><span
						     >As required by
						     law, for example, to comply with a valid subpoena or other legal process;
						     when we believe in good faith that disclosure is necessary to protect our
						     rights, or to protect your safety (or the safety of others); to
						     investigate fraud; or to respond to a government request.</span></li>
						</ul>

						<p className={styles.MsoNormal}><span
						>We
						may also disclose your personal information to any third party with your prior
						consent.</span></p>

						<p className={styles.MsoNormal} ><b><span >5. Communications</span></b></p>

						<p className={styles.MsoNormal}><i><span
						>one f
						Jef, Inc.</span></i><span > may need to communicate with you for a variety of different
						reasons, including:</span></p>

						<ul type={'disc'}>
						 <li className={styles.MsoNormal} ><span
						     >Responding to
						     your questions and requests. If you contact us with a problem or question,
						     we will use your information to respond.</span></li>
						 <li className={styles.MsoNormal} ><span
						     >Sending you
						     Service and administrative emails and messages. We may contact you to
						     inform you about changes in our Services, our Service offerings, and
						     important Service related notices, such as billing, security and fraud
						     notices. These emails and messages are considered a necessary part of the
						     Services and you may not opt-out of them.</span></li>
						 <li className={styles.MsoNormal} ><span
						     >Sending emails
						     about new products or other news about <i>one f Jef, Inc.</i> that we
						     think you'd like to hear about either from us or from our business
						     partners. You can always opt out of these types of messages at any time by
						     clicking the unsubscribe link at the bottom of each communication.</span></li>
						 <li className={styles.MsoNormal} ><span
						     >Conducting
						     surveys. We may use the information gathered in the surveys to enhance and
						     personalize our products, services, and websites.</span></li>
						 <li className={styles.MsoNormal} ><span
						     >Offering
						     referral programs and incentives, which allow you to utilize email, text,
						     or URL links that you can share with friends or colleagues.</span></li>
						</ul>

						<p className={styles.MsoNormal} ><b><span >6. Accessing Your Data</span></b></p>

						<p className={styles.MsoNormal}><span
						>Our
						customers can always review, update or change personal information from within
						their account. <i>one f Jef, Inc.</i> will also, when you request, provide you
						with information about whether we hold, or process on behalf of a third party,
						any of your personal information.&nbsp; Please&nbsp;</span><u><span
						><a className={styles.link}
						href="mailto: support@ecademy.app"><span >contact
						us here</span></a></span></u><span >&nbsp;if you need assistance in reviewing your information. <i>one
						f Jef, Inc.</i> will respond to your access request to review the information
						we have on file for you within a reasonable time.</span></p>

						<p className={styles.MsoNormal}><span
						>We
						may also collect information on behalf of our customers, to provide the
						services, and we may not have a direct relationship with the individuals whose
						personal data is processed. If you are a customer or end-user of one of our
						customers, please contact them (as the data controller) directly if: (i) you
						would no longer like to be contacted by them; or (ii) to access, correct,
						amend, or delete inaccurate data. &nbsp;If requested to remove data by our
						customer, we will respond within a reasonable timeframe.</span></p>

						<p className={styles.MsoNormal}><span
						>We
						may transfer personal information to companies that help us provide our
						service, and when we do, these transfers to subsequent third parties are
						covered by appropriate transfer agreements. We will retain personal data we
						process on behalf of our customer as needed to provide services to our
						customer. Also, we will retain this personal information as necessary to comply
						with our legal obligations, resolve disputes, and enforce our agreements.</span></p>

						<p className={styles.MsoNormal}><i><span
						>one f
						Jef, Inc.</span></i><span > is headquartered in the United States of America and maintains
						a global infrastructure.&nbsp; Information that we collect and maintain may be
						transferred to, or controlled and processed in, the United States and/or other
						countries around the world. When you provide us with information, or use our
						website(s) and services, you consent to this transfer.&nbsp; We will protect
						the privacy and security of personal information we collect in accordance with
						this privacy policy, regardless of where it is processed or stored.</span></p>

						<p className={styles.MsoNormal} ><b><span >7. Security</span></b></p>

						<p className={styles.MsoNormal}><i><span
						>one f
						Jef, Inc.</span></i><span > follows generally accepted standards to protect the personal
						information submitted to us, both during transmission and once it is received,
						however, no security measure is perfect. We recommend safeguarding your
						password, as it is one of the easiest ways you can manage the security of your
						own account - remember that if you lose control over your password, you may
						lose control over your personal information.</span></p>

						<p className={styles.MsoNormal} ><b><span >8. Changes to this Statement/Contact Us</span></b></p>

						<p className={styles.MsoNormal}><span
						>We
						may update this Privacy Policy to reflect changes to our information practices.
						If we make any material changes we will provide notice on this website, and we
						may notify you by email (sent to the e-mail address specified in your account),
						prior to the change becoming effective. We encourage you to periodically review
						this page for the latest information on our privacy practices. If you continue
						to use the Services after those changes are in effect, you agree to the revised
						policy.</span></p>

						<p className={styles.MsoNormal}><span
						>If
						you have any other questions about this policy please contact</span><u><span
						><a className={styles.link}
						href="mailto:support@ecademy.app"><span >&nbsp;</span><i><span>one f Jef, Inc.</span></i><span
						>Privacy Team</span></a></span></u><span >, or call +1 801
						318-7907 or write to us via postal mail at: &nbsp;<i>one f Jef, Inc.</i>, 187
						W. 510 S. American Fork, UT 84003.</span></p>

						<p className={styles.MsoNormal}>&nbsp;</p>

						<OneFJefFooter />
				</div>
    );
  }
}
