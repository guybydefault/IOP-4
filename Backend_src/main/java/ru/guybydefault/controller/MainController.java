package ru.guybydefault.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Validator;
import org.springframework.web.bind.annotation.*;
import ru.guybydefault.auth.UserPrincipalImpl;
import ru.guybydefault.entity.AreaCheckResult;
import ru.guybydefault.entity.User;
import ru.guybydefault.repository.AreaCheckResultRepository;
import ru.guybydefault.repository.UserRepository;
import ru.guybydefault.service.AbstractAreaCheckCalculator;

import javax.persistence.EntityManagerFactory;
import java.util.List;

@CrossOrigin(origins = {"https://se.ifmo.ru", "http://localhost"}, maxAge = 3600)
@RestController(value = "/api")
@RequestMapping("/api")
public class MainController {

    @Autowired
    @Qualifier(value = "areaCheckCalulator28709")
    private AbstractAreaCheckCalculator areaCheckCalculator;

    @Autowired
    @Qualifier(value = "areaCheckRequestValidator28709")
    private Validator areaCheckRequestValidator;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AreaCheckResultRepository areaCheckResultRepository;

    @Autowired
    PasswordEncoder passwordEncoder;


    @ModelAttribute("user")
    public User getUser() {
        Object o = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (o instanceof UserPrincipalImpl) {
            return userRepository.findByName(((UserPrincipalImpl) o).getUsername());
        } else {
            return null;
        }
    }

    @RequestMapping(value = "register", method = RequestMethod.POST)
    public String register(@RequestParam String username, @RequestParam String password) {
        User user = userRepository.findByName(username);
        if (password == null || password.trim().isEmpty()) {
            return "{\"error\": \"пароль не может быть пустой строкой\"}";
        }
        if (user == null) {
            userRepository.save(new User(username, passwordEncoder.encode(password)));
            return null;
        } else {
            return "{\"error\": \"имя " + username + " уже зарегистрировано\"}";
        }

    }

    @RequestMapping(value = "user")
    public User user(ModelMap modelMap) {
        return (User) modelMap.get("user");
    }

    @RequestMapping(value = "history", method = RequestMethod.GET)
    public List<AreaCheckResult> getChecksHistory(ModelMap modelMap) {
        return areaCheckResultRepository.findFirst50ByUserOrderByIdDesc(((User) modelMap.get("user")));
    }

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    @RequestMapping(value = "check", method = RequestMethod.POST, consumes = {"application/json"})
    public ResponseEntity check(@RequestBody AreaCheckRequest areaCheckRequest, BindingResult bindingResult,
                                @ModelAttribute("user") User user
    ) {
        areaCheckRequestValidator.validate(areaCheckRequest, bindingResult);
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
        }
        AreaCheckResult areaCheckResult = areaCheckCalculator.getResult(areaCheckRequest);
        areaCheckResult.setUser(user);
        user.addCheckResult(areaCheckResult);
        userRepository.save(user);
        return ResponseEntity.ok(areaCheckResult);
    }
}
